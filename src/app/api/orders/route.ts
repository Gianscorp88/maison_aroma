import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getPaymentProvider } from '@/lib/payment-provider';
import { getProductById, getAllProducts } from '@/lib/products-store';
import { getCustomizerConfig } from '@/lib/customizer-config-store';
import { sendOrderConfirmationEmail } from '@/lib/email-service';
import { getShopSettings } from '@/lib/shop-settings-store';

export async function POST(req: Request) {
  try {
    // Check global Shop Mode status
    const shopSettings = getShopSettings();
    if (!shopSettings.isShopMode) {
      return NextResponse.json(
        { error: 'La modalità acquisto online è temporaneamente disattivata. Il sito è in modalità vetrina.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      street,
      city,
      province,
      postalCode,
      country,
      eventType,
      eventDate,
      paymentMethod,
      items,
      notes,
    } = body;

    if (!customerEmail || !customerName || !items || items.length === 0) {
      return NextResponse.json({ error: 'Campi obbligatori mancanti per la creazione dell\'ordine.' }, { status: 400 });
    }

    // 1. Ensure default Category exists in SQLite DB for product creation
    let defaultCategory = await db.category.findFirst();
    if (!defaultCategory) {
      defaultCategory = await db.category.create({
        data: {
          name: 'Generica',
          slug: 'generica',
          description: 'Categoria Generica Maison Aroma',
        },
      });
    }

    let subtotal = 0;
    const validatedItems = [];

    // 2. Validate products dynamically (Prisma DB -> products-store.ts -> customizer-config -> snapshot fallback)
    for (const item of items) {
      const targetId = item.productId || `prod_${Date.now()}`;
      
      // Step A: Multi-source product lookup
      let foundProduct: any = await db.product.findUnique({ where: { id: targetId } });
      
      if (!foundProduct) {
        foundProduct = getProductById(targetId);
      }

      if (!foundProduct) {
        const customizerModels = getCustomizerConfig().models || [];
        const customizerMatch = customizerModels.find((m) => m.id === targetId);
        if (customizerMatch) {
          foundProduct = {
            id: customizerMatch.id,
            name: customizerMatch.name,
            basePrice: customizerMatch.basePrice,
            minQuantity: customizerMatch.minQuantity || 10,
            images: [customizerMatch.image],
          };
        }
      }

      if (!foundProduct) {
        const allProducts = getAllProducts();
        foundProduct = allProducts.find((p) => p.id === targetId || p.slug === targetId);
      }

      // Step B: Snapshot Fallback for legacy cart items or deleted products
      const productName = foundProduct?.name || item.name || 'Candela Personalizzata Maison Aroma';
      const productBasePrice = foundProduct?.basePrice || item.basePrice || item.unitPrice || 16.0;
      const productMinQty = foundProduct?.minQuantity || 1;
      const rawImages = foundProduct?.galleryImages
        ? foundProduct.galleryImages.map((g: any) => g.url)
        : foundProduct?.images
        ? (typeof foundProduct.images === 'string' ? JSON.parse(foundProduct.images) : foundProduct.images)
        : [item.image || '/images/collezione-dessert-gourmet.jpg'];

      // Step C: Guarantee product exists in SQLite Prisma DB to satisfy foreign key constraints
      const guaranteedProduct = await db.product.upsert({
        where: { id: targetId },
        update: {
          name: productName,
          basePrice: productBasePrice,
        },
        create: {
          id: targetId,
          name: productName,
          slug: `slug-${targetId.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
          description: productName,
          basePrice: productBasePrice,
          sku: `SKU-${targetId}`,
          images: JSON.stringify(rawImages),
          minQuantity: productMinQty,
          categoryId: defaultCategory.id,
        },
      });

      // Step D: Calculate pricing & packaging
      let packagingPrice = 0;
      if (item.customization?.packagingPrice) {
        packagingPrice = Number(item.customization.packagingPrice);
      }

      const rawPrice = guaranteedProduct.basePrice + packagingPrice;
      const qty = Math.max(guaranteedProduct.minQuantity || 1, item.quantity || 1);

      let discountRatio = 1.0;
      if (qty >= 200) discountRatio = 0.60;
      else if (qty >= 100) discountRatio = 0.65;
      else if (qty >= 50) discountRatio = 0.75;
      else if (qty >= 30) discountRatio = 0.85;
      else if (qty >= 10) discountRatio = 0.90;

      const unitPrice = item.unitPrice || Number((rawPrice * discountRatio).toFixed(2));
      subtotal += unitPrice * qty;

      validatedItems.push({
        productId: guaranteedProduct.id,
        unitPrice,
        quantity: qty,
        customization: JSON.stringify(item.customization || {}),
      });
    }

    const shippingFee = subtotal >= 150 ? 0.0 : 12.0;
    const totalAmount = Number((subtotal + shippingFee).toFixed(2));

    const orderNumber = `MA-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // 3. Process via Payment Provider Abstraction
    const paymentProvider = getPaymentProvider();
    const paymentResult = await paymentProvider.processPayment({
      amount: totalAmount,
      currency: 'EUR',
      orderNumber,
      customerEmail,
      paymentMethod,
    });

    if (!paymentResult.success && paymentMethod === 'TEST_DECLINED') {
      return NextResponse.json({
        error: 'Simulazione Pagamento Rifiutato. Seleziona un metodo di prova approvato per procedere.',
        paymentStatus: 'FAILED',
      }, { status: 400 });
    }

    // Determine initial order & proof status based on customization
    const hasCustomization = validatedItems.some((i) => {
      try {
        const c = JSON.parse(i.customization);
        return c.namesText || c.dateText || c.phraseText || c.eventType;
      } catch (e) {
        return false;
      }
    });

    const proofStatus = hasCustomization ? 'AWAITING_PROOF' : 'NOT_REQUIRED';
    const orderStatus = hasCustomization ? 'PROOF_PENDING' : 'RECEIVED';

    // 4. Save Order to SQLite Database
    const newOrder = await db.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        customerPhone: customerPhone || '',
        shippingAddress: JSON.stringify({ street, city, province, postalCode, country }),
        eventType: eventType || 'Generico',
        eventDate: eventDate ? new Date(eventDate) : null,
        status: orderStatus,
        paymentStatus: paymentResult.paymentStatus,
        paymentProvider: paymentResult.provider,
        paymentMethod: paymentMethod,
        subtotal,
        shippingFee,
        totalAmount,
        notes: notes || '',
        proofStatus,
        items: {
          create: validatedItems,
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    // Send automatic confirmation email
    await sendOrderConfirmationEmail(newOrder);

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      paymentStatus: newOrder.paymentStatus,
      message: paymentResult.message,
    });
  } catch (error: any) {
    console.error('Failed creating order:', error);
    return NextResponse.json({ error: error.message || 'Errore server durante la creazione dell\'ordine' }, { status: 500 });
  }
}
