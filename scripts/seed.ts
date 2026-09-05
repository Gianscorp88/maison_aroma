import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Maison Aroma Creazioni Database Seeding...');

  // Clean existing database
  await prisma.wishlist.deleteMany();
  await prisma.proofVersion.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.quoteRequest.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.productCustomizationGroup.deleteMany();
  await prisma.customizationOption.deleteMany();
  await prisma.customizationGroup.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Default Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@maisonaroma.it',
      password: hashedPassword,
      name: 'Gianandrea (Maison Owner)',
      role: 'ADMIN',
      phone: '+39 340 1234567',
    },
  });

  const productionManager = await prisma.user.create({
    data: {
      email: 'produzione@maisonaroma.it',
      password: hashedPassword,
      name: 'Elena (Atelier Master)',
      role: 'PRODUCTION',
      phone: '+39 340 7654321',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'sposa@maisonaroma.it',
      password: hashedPassword,
      name: 'Giulia Bianchi',
      role: 'CUSTOMER',
      phone: '+39 333 9988776',
    },
  });

  console.log('👤 Users created:', admin.email, productionManager.email, customer.email);

  // 2. Create Categories
  const catWedding = await prisma.category.create({
    data: {
      name: 'Bomboniere Matrimonio',
      slug: 'matrimonio',
      description: 'Candele artigianali e personalizzate per creare un ricordo olfattivo unico per i tuoi ospiti.',
    },
  });

  const catBaptism = await prisma.category.create({
    data: {
      name: 'Battesimi & Nascita',
      slug: 'battesimo',
      description: 'Delicate candele personalizzate per festeggiare nuovi arrivi e momenti speciali di famiglia.',
    },
  });

  const catCommunion = await prisma.category.create({
    data: {
      name: 'Comunioni & Cresime',
      slug: 'comunione',
      description: 'Candele eleganti per sacramenti e cerimonie, confezionate con tessuti naturali.',
    },
  });

  const catCorporate = await prisma.category.create({
    data: {
      name: 'Eventi Aziendali & Luxury Gifts',
      slug: 'corporate',
      description: 'Regali istituzionali con logo inciso, packaging personalizzato e fragranze di alta profumeria.',
    },
  });

  const catDecorative = await prisma.category.create({
    data: {
      name: 'Candele Decorative d’Arredo',
      slug: 'decorative',
      description: 'Sculture in cera di soia 100% naturale colate a mano per abbellire tavoli e cerimonie.',
    },
  });

  const catSpecialCollections = await prisma.category.create({
    data: {
      name: 'Collezioni Particolari',
      slug: 'collezioni-particolari',
      description: 'Collezioni artistiche esclusive: Dessert Gourmet, Romance & Oro, Minimal Design Architetturale.',
    },
  });

  console.log('🏷️ Categories created.');

  // 3. Create Customization Groups & Options
  const fragGroup = await prisma.customizationGroup.create({
    data: {
      title: 'Fragranza d’Autore',
      type: 'FRAGRANCE',
      required: true,
      options: {
        create: [
          {
            label: 'Rosa di Maggio & Legno di Rosa',
            description: 'Rosa Centifolia, Bergamotto, Legno di Cedro, Muschio Rosa',
            priceOffset: 0.0,
          },
          {
            label: 'Fichi di Toscana & Foglia d’Olivo',
            description: 'Nettare di Figo, Note Verdi d’Olivo, Legno di Sandalo',
            priceOffset: 0.0,
          },
          {
            label: 'Champagne & Pesca Bianca',
            description: 'Bollicine di Franciacorta, Pesca di Leonforte, Fiori di Magnolia',
            priceOffset: 0.5,
          },
          {
            label: 'Lavanda Selvatica & Miele Dorato',
            description: 'Fiori di Lavanda di Provenza, Miele d’Acacia, Vaniglia Bourbon',
            priceOffset: 0.0,
          },
          {
            label: 'Agrumi di Sicilia & Neroli',
            description: 'Arancia Amara, Fiori d’Arancio Neroli, Ambra Calda',
            priceOffset: 0.0,
          },
          {
            label: 'Oud Reale & Pepe Rosa',
            description: 'Legno di Oud, Pepe Rosa delle Bourbon, Note Speziate',
            priceOffset: 1.0,
          },
        ],
      },
    },
  });

  const containerGroup = await prisma.customizationGroup.create({
    data: {
      title: 'Contenitore & Colore',
      type: 'COLOR',
      required: true,
      options: {
        create: [
          {
            label: 'Bicchiere Vetro Avorio Trasparente',
            description: 'Vetro italiano soffiato con riflessi avorio opaco',
            priceOffset: 0.0,
            colorHex: '#F7F3E9',
          },
          {
            label: 'Vetro Ambrato Apothecary',
            description: 'Vetro stile farmaceutico d’epoca con tappo in alluminio dorato',
            priceOffset: 0.5,
            colorHex: '#C5A059',
          },
          {
            label: 'Vetro Nero Satinato Luxury',
            description: 'Finitura opaca vellutata di grande impatto visivo',
            priceOffset: 1.0,
            colorHex: '#2C221E',
          },
          {
            label: 'Gesso Ceramico Colato a Mano',
            description: 'Vaso artigianale impermeabilizzato traslucido',
            priceOffset: 1.5,
            colorHex: '#EAE5DC',
          },
        ],
      },
    },
  });

  const ribbonGroup = await prisma.customizationGroup.create({
    data: {
      title: 'Nastro in Seta o Lino',
      type: 'SELECT',
      required: true,
      options: {
        create: [
          { label: 'Seta Sfilacciata Oro Champenoise', priceOffset: 0.0, colorHex: '#C5A059' },
          { label: 'Lino Naturale Grezzo', priceOffset: 0.0, colorHex: '#EAE5DC' },
          { label: 'Seta Rosa Cipria', priceOffset: 0.0, colorHex: '#E8D5D0' },
          { label: 'Seta Verde Salvia', priceOffset: 0.0, colorHex: '#D2DDD0' },
          { label: 'Doppio Raso Bianco Neve', priceOffset: 0.0, colorHex: '#FFFFFF' },
        ],
      },
    },
  });

  const packGroup = await prisma.customizationGroup.create({
    data: {
      title: 'Packaging & Confezione Evento',
      type: 'PACKAGING',
      required: true,
      options: {
        create: [
          {
            label: 'Sacchetto in Lino Naturale Ricamato',
            description: 'Custodia morbida in puro lino con cordoncino in corda',
            priceOffset: 1.5,
          },
          {
            label: 'Scatola Rigid Box Avorio con Nastro',
            description: 'Astuccio rigido di lusso rivestito a mano',
            priceOffset: 2.5,
          },
          {
            label: 'Scatola Trasparente Cristallo con Paglia Naturale',
            description: 'Protezione rigida visibile ideale per bomboniere',
            priceOffset: 1.2,
          },
          {
            label: 'Nessuna Confezione Singola (Sfusa in Box)',
            description: 'Confezionamento ecologico in lotti da imballo',
            priceOffset: 0.0,
          },
        ],
      },
    },
  });

  console.log('⚙️ Customization groups & options populated.');

  // 4. Create Products
  const prod1 = await prisma.product.create({
    data: {
      name: 'Candela Bomboniera Matrimonio "Sinfonia Olfattiva"',
      slug: 'candela-bomboniera-matrimonio-sinfonia-olfattiva',
      description: 'La nostra candela iconica per matrimoni. Realizzata in cera di soia 100% botanica e colata a mano in Italia. Personalizzabile con nomi degli sposi, data, fragranza d’autore e etichetta goffrata oro.',
      shortDescription: 'Bomboniera di lusso personalizzabile per matrimoni e ricevimenti eleganti.',
      basePrice: 18.0,
      costPrice: 6.5,
      sku: 'MA-WED-001',
      isCustomizable: true,
      featured: true,
      isBestSeller: true,
      minQuantity: 10,
      productionDays: 7,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1000&auto=format&fit=crop',
      ]),
      waxType: 'Cera di Soia & Cocco 100% Naturale',
      burnTime: '38 Ore',
      dimensions: '7.5 cm (D) x 8.5 cm (H)',
      weight: '170g cera netta',
      categoryId: catWedding.id,
      variants: {
        create: [
          { name: '170g Vetro Avorio Premium', priceOffset: 0.0, stock: 500 },
          { name: '240g Vetro Trasparente Scanalato', priceOffset: 4.0, stock: 300 },
          { name: '90g Mini Favor Petit', priceOffset: -5.0, stock: 800 },
        ],
      },
    },
  });

  const prod2 = await prisma.product.create({
    data: {
      name: 'Candela Battesimo & Nascita "Dolce Abbraccio"',
      slug: 'candela-battesimo-dolce-abbraccio',
      description: 'Candela artigianale delicata pensata per festeggiare il battesimo o la nascita. Personalizzabile con il nome del bimbo/bimba, la data e nastro in seta rosa o salvia.',
      shortDescription: 'Favore profumato per battesimo con dettagli in seta ed etichetta coordinata.',
      basePrice: 15.0,
      costPrice: 5.2,
      sku: 'MA-BAP-002',
      isCustomizable: true,
      featured: true,
      isBestSeller: true,
      minQuantity: 10,
      productionDays: 5,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1572726729207-a78d6fea3177?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1000&auto=format&fit=crop',
      ]),
      waxType: 'Cera di Soia Bio',
      burnTime: '30 Ore',
      dimensions: '7 cm (D) x 7.5 cm (H)',
      weight: '140g cera netta',
      categoryId: catBaptism.id,
      variants: {
        create: [
          { name: '140g Vetro Satinato Rosa', priceOffset: 0.0, stock: 400 },
          { name: '140g Vetro Satinato Azzurro', priceOffset: 0.0, stock: 400 },
        ],
      },
    },
  });

  const prod3 = await prisma.product.create({
    data: {
      name: 'Apothecary Amber Glass Corporate Candle',
      slug: 'apothecary-amber-glass-corporate-candle',
      description: 'Candela dal carattere sofisticato in vetro ambrato d’epoca. Ideale per omaggi aziendali di prestigio, hotel e ristoranti stellati. Incisione su etichetta metallica dorata o carta cotone.',
      shortDescription: 'Regalo corporate di lusso con stampa logo e fragranza custom.',
      basePrice: 22.0,
      costPrice: 8.0,
      sku: 'MA-CORP-003',
      isCustomizable: true,
      featured: true,
      isBestSeller: false,
      minQuantity: 20,
      productionDays: 10,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1572726729207-a78d6fea3177?q=80&w=1000&auto=format&fit=crop',
      ]),
      waxType: 'Cera di Soia & Palma Certificata RSPO',
      burnTime: '50 Ore',
      dimensions: '8.5 cm (D) x 10 cm (H)',
      weight: '250g cera netta',
      categoryId: catCorporate.id,
      variants: {
        create: [
          { name: '250g Vetro Ambrato Tappo Dorato', priceOffset: 0.0, stock: 250 },
        ],
      },
    },
  });

  const prod4 = await prisma.product.create({
    data: {
      name: 'Gift Box Luxury "Maison Aroma Experience"',
      slug: 'gift-box-luxury-maison-aroma-experience',
      description: 'Elegante cofanetto regalo rigido avorio contenente 3 candele d’atmosfera in fragranze coordinati, completo di fiammiferi d’autore in legno di sasso.',
      shortDescription: 'Cofanetto regalo completo in scatola rigida di lusso.',
      basePrice: 65.0,
      costPrice: 22.0,
      sku: 'MA-GIFT-004',
      isCustomizable: true,
      featured: true,
      isBestSeller: true,
      minQuantity: 1,
      productionDays: 3,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1000&auto=format&fit=crop',
      ]),
      waxType: 'Cera Botanica Mix',
      burnTime: '3x 30 Ore',
      dimensions: '28 cm x 18 cm x 10 cm',
      weight: '600g cera totale',
      categoryId: catCorporate.id,
      variants: {
        create: [
          { name: 'Cofanetto 3 Candele 120g', priceOffset: 0.0, stock: 120 },
        ],
      },
    },
  });

  // Collezione Dessert Products
  const dessert1 = await prisma.product.create({
    data: {
      name: 'Coppa Chantilly & Fragoline di Bosco',
      slug: 'coppa-chantilly-fragoline',
      description: 'Candela iperrealista in coppa gelato da dessert. Cera di soia lavorata a spuma panna, fragoline in cera fatte a mano e fragranza di Vaniglia Bourbon e Fragola d’Alba.',
      shortDescription: 'Panna spumata a mano e fragoline in cera gourmand.',
      basePrice: 24.0,
      costPrice: 8.5,
      sku: 'MA-DESSERT-01',
      isCustomizable: true,
      featured: true,
      isBestSeller: true,
      minQuantity: 5,
      productionDays: 5,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1000&auto=format&fit=crop',
      ]),
      waxType: 'Cera di Soia Spumata a Mano',
      burnTime: '40 Ore',
      dimensions: '9 cm (D) x 12 cm (H)',
      weight: '220g',
      categoryId: catSpecialCollections.id,
      variants: { create: [{ name: 'Coppa Dessert 220g', priceOffset: 0.0, stock: 150 }] },
    },
  });

  const dessert2 = await prisma.product.create({
    data: {
      name: 'Coppa Tiramisù & Cacao d’Etiopia',
      slug: 'coppa-tiramisu-cacao',
      description: 'Creazione dolciaria profumata con note d’Espresso e Cacao amaro. Strati di crema di soia spumata e granella croccante in cera.',
      shortDescription: 'Note intense di Caffè Espresso e Cacao in cera soffice.',
      basePrice: 25.0,
      costPrice: 8.8,
      sku: 'MA-DESSERT-02',
      isCustomizable: true,
      featured: false,
      isBestSeller: true,
      minQuantity: 5,
      productionDays: 5,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1572726729207-a78d6fea3177?q=80&w=1000&auto=format&fit=crop',
      ]),
      waxType: 'Cera Botanica Soia & Cocco',
      burnTime: '42 Ore',
      dimensions: '9 cm (D) x 11.5 cm (H)',
      weight: '230g',
      categoryId: catSpecialCollections.id,
      variants: { create: [{ name: 'Coppa Tiramisù 230g', priceOffset: 0.0, stock: 120 }] },
    },
  });

  const dessert3 = await prisma.product.create({
    data: {
      name: 'Coppa Panna Cotta & Caramello Salato',
      slug: 'coppa-panna-cotta-caramello',
      description: 'Deliziosa composizione gourmand con colatura di caramello salato in cera liquida e bacche di vaniglia naturale.',
      shortDescription: 'Cera lavorata con colatura al caramello salato d’Isigny.',
      basePrice: 24.0,
      costPrice: 8.5,
      sku: 'MA-DESSERT-03',
      isCustomizable: true,
      featured: false,
      isBestSeller: false,
      minQuantity: 5,
      productionDays: 5,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop',
      ]),
      waxType: 'Cera di Soia Gourmet',
      burnTime: '40 Ore',
      dimensions: '8.5 cm (D) x 11 cm (H)',
      weight: '210g',
      categoryId: catSpecialCollections.id,
      variants: { create: [{ name: 'Coppa Caramello 210g', priceOffset: 0.0, stock: 140 }] },
    },
  });

  // Collezione Romance Products
  const romance1 = await prisma.product.create({
    data: {
      name: 'Rosa Incantata & Foglia d’Oro 24k',
      slug: 'romance-rosa-incantata-oro',
      description: 'Creazione poetica impreziosita da boccioli di rosa essiccati a mano e scaglie in foglia d’oro 24k in vetro apothecary.',
      shortDescription: 'Boccioli di rosa vera e lamina in oro 24k.',
      basePrice: 26.0,
      costPrice: 9.0,
      sku: 'MA-ROMANCE-01',
      isCustomizable: true,
      featured: true,
      isBestSeller: true,
      minQuantity: 5,
      productionDays: 5,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1000&auto=format&fit=crop',
      ]),
      waxType: 'Cera Botanica & Fiori Essiccati',
      burnTime: '45 Ore',
      dimensions: '8.5 cm (D) x 10 cm (H)',
      weight: '230g',
      categoryId: catSpecialCollections.id,
      variants: { create: [{ name: 'Vetro Romance 230g', priceOffset: 0.0, stock: 200 }] },
    },
  });

  const romance2 = await prisma.product.create({
    data: {
      name: 'Peonia Nobile & Quarzo Rosa',
      slug: 'romance-peonia-quarzo-rosa',
      description: 'Delicata composizione ispirata all’amore con petali di peonia rosa, fiori di magnolia e piccolo quarzo rosa d’arredo.',
      shortDescription: 'Petali di peonia cipria e frammenti di quarzo rosa.',
      basePrice: 27.0,
      costPrice: 9.2,
      sku: 'MA-ROMANCE-02',
      isCustomizable: true,
      featured: false,
      isBestSeller: true,
      minQuantity: 5,
      productionDays: 5,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1572726729207-a78d6fea3177?q=80&w=1000&auto=format&fit=crop',
      ]),
      waxType: 'Cera di Soia Naturale',
      burnTime: '48 Ore',
      dimensions: '9 cm (D) x 10.5 cm (H)',
      weight: '240g',
      categoryId: catSpecialCollections.id,
      variants: { create: [{ name: 'Vetro Peonia 240g', priceOffset: 0.0, stock: 160 }] },
    },
  });

  // Collezione Minimal Design Products
  const minimal1 = await prisma.product.create({
    data: {
      name: 'Monolite Scultoreo Cemento Avorio',
      slug: 'minimal-monolite-cemento-avorio',
      description: 'Vaso artigianale colato in gesso ceramico ed elementi in cemento avorio con cera vegetale di soia 100% pura.',
      shortDescription: 'Architettura minimale e vaso materico riutilizzabile.',
      basePrice: 28.0,
      costPrice: 9.5,
      sku: 'MA-MINIMAL-01',
      isCustomizable: true,
      featured: true,
      isBestSeller: false,
      minQuantity: 5,
      productionDays: 6,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1000&auto=format&fit=crop',
      ]),
      waxType: 'Cera di Soia Naturale',
      burnTime: '55 Ore',
      dimensions: '10 cm (D) x 11 cm (H)',
      weight: '300g',
      categoryId: catSpecialCollections.id,
      variants: { create: [{ name: 'Vaso Cemento 300g', priceOffset: 0.0, stock: 180 }] },
    },
  });

  const minimal2 = await prisma.product.create({
    data: {
      name: 'Cilindro Nero Velvet Architect',
      slug: 'minimal-cilindro-nero-architect',
      description: 'Contenitore nero satinato opaco vellutato al tatto con linea geometrica pura e fragranza legnosa al Pepe Nero e Palo Santo.',
      shortDescription: 'Vetro opaco vellutato nero con fragranza al Palo Santo.',
      basePrice: 29.0,
      costPrice: 9.8,
      sku: 'MA-MINIMAL-02',
      isCustomizable: true,
      featured: false,
      isBestSeller: true,
      minQuantity: 5,
      productionDays: 6,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop',
      ]),
      waxType: 'Cera di Soia & Cocco',
      burnTime: '50 Ore',
      dimensions: '9.5 cm (D) x 11 cm (H)',
      weight: '280g',
      categoryId: catSpecialCollections.id,
      variants: { create: [{ name: 'Vetro Nero Architect 280g', priceOffset: 0.0, stock: 150 }] },
    },
  });

  // Link Customization groups to products
  const groupIds = [fragGroup.id, containerGroup.id, ribbonGroup.id, packGroup.id];
  for (const prod of [prod1, prod2, prod3, prod4, dessert1, dessert2, dessert3, romance1, romance2, minimal1, minimal2]) {
    for (const gid of groupIds) {
      await prisma.productCustomizationGroup.create({
        data: {
          productId: prod.id,
          groupId: gid,
        },
      });
    }
  }

  console.log('🕯️ Products & Customization bindings created.');

  // 5. Inventory Raw Materials
  await prisma.inventoryItem.createMany({
    data: [
      { name: 'Cera di Soia Biologica 100%', category: 'WAX', stock: 450, unit: 'kg', minAlert: 50 },
      { name: 'Bicchieri Vetro Avorio 170g', category: 'CONTAINER', stock: 1200, unit: 'pcs', minAlert: 200 },
      { name: 'Bicchieri Vetro Ambrato 250g', category: 'CONTAINER', stock: 650, unit: 'pcs', minAlert: 100 },
      { name: 'Olio Essenziale Rosa di Maggio', category: 'FRAGRANCE', stock: 25, unit: 'liters', minAlert: 5 },
      { name: 'Olio Essenziale Fichi & Olivo', category: 'FRAGRANCE', stock: 18, unit: 'liters', minAlert: 3 },
      { name: 'Nastro in Seta Sfilacciata Oro', category: 'RIBBON', stock: 850, unit: 'meters', minAlert: 100 },
      { name: 'Scatole Luxury Avorio', category: 'PACKAGING', stock: 500, unit: 'pcs', minAlert: 80 },
    ],
  });

  console.log('📦 Inventory populated.');

  // 6. Create Sample Orders
  const sampleOrder1 = await prisma.order.create({
    data: {
      orderNumber: 'MA-2026-8801',
      userId: customer.id,
      customerName: 'Giulia Bianchi',
      customerEmail: 'sposa@maisonaroma.it',
      customerPhone: '+39 333 9988776',
      shippingAddress: JSON.stringify({
        street: 'Via della Spiga 14',
        city: 'Milano',
        province: 'MI',
        postalCode: '20121',
        country: 'Italia',
      }),
      eventType: 'Matrimonio',
      eventDate: new Date('2026-09-15'),
      status: 'IN_PRODUCTION',
      paymentStatus: 'PAID',
      paymentProvider: 'LOCAL',
      paymentMethod: 'TEST_APPROVED',
      subtotal: 765.0,
      shippingFee: 0.0,
      discountAmount: 114.75,
      totalAmount: 650.25,
      notes: 'Consegna richiesta entro il 5 Settembre per allestimento villa.',
      proofStatus: 'APPROVED',
      items: {
        create: [
          {
            productId: prod1.id,
            unitPrice: 15.3,
            quantity: 50,
            customization: JSON.stringify({
              eventType: 'Matrimonio',
              fragrance: 'Rosa di Maggio & Legno di Rosa',
              waxColor: '#FDFBF7',
              containerColor: '#EAE5DC',
              ribbonColor: '#C5A059',
              fontStyle: 'classic-serif',
              namesText: 'Giulia & Marco',
              dateText: '15 Settembre 2026',
              phraseText: 'Grazie per festeggiare con noi',
              packaging: 'Scatola Rigid Box Avorio con Nastro',
            }),
          },
        ],
      },
      proofs: {
        create: [
          {
            version: 1,
            imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop',
            notes: 'Bozza etichetta con carattere serif dorato su carta cotone avorio.',
            status: 'APPROVED',
            feedback: 'Approvato! Stampa perfetta.',
          },
        ],
      },
    },
  });

  const sampleOrder2 = await prisma.order.create({
    data: {
      orderNumber: 'MA-2026-8802',
      customerName: 'Alessandro Rossi',
      customerEmail: 'alessandro.rossi@luxuryevents.it',
      customerPhone: '+39 347 5544332',
      shippingAddress: JSON.stringify({
        street: 'Corso Vittorio Emanuele 45',
        city: 'Firenze',
        province: 'FI',
        postalCode: '50123',
        country: 'Italia',
      }),
      eventType: 'Eventi Aziendali',
      eventDate: new Date('2026-10-20'),
      status: 'PROOF_PENDING',
      paymentStatus: 'AWAITING_TRANSFER',
      paymentProvider: 'LOCAL',
      paymentMethod: 'BANK_TRANSFER',
      subtotal: 1100.0,
      shippingFee: 15.0,
      discountAmount: 0.0,
      totalAmount: 1115.0,
      notes: 'Incidere logo aziendale Luxury Events su bollino oro.',
      proofStatus: 'PROOF_SENT',
      items: {
        create: [
          {
            productId: prod3.id,
            unitPrice: 22.0,
            quantity: 50,
            customization: JSON.stringify({
              eventType: 'Eventi Aziendali',
              fragrance: 'Agrumi di Sicilia & Neroli',
              waxColor: '#FDFBF7',
              containerColor: '#C5A059',
              ribbonColor: '#C5A059',
              fontStyle: 'minimal-sans',
              namesText: 'Luxury Events Gala 2026',
              dateText: '20 Ottobre 2026',
              phraseText: 'Annual Corporate Summit',
              packaging: 'Sacchetto in Lino Naturale Ricamato',
            }),
          },
        ],
      },
      proofs: {
        create: [
          {
            version: 1,
            imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop',
            notes: 'Anteprima bozza logo su vetro ambrato d’epoca.',
            status: 'PENDING',
          },
        ],
      },
    },
  });

  console.log('📜 Orders & Proofs seeded:', sampleOrder1.orderNumber, sampleOrder2.orderNumber);

  // 7. Create Sample Quotes
  await prisma.quoteRequest.create({
    data: {
      userId: customer.id,
      name: 'Giulia Bianchi',
      email: 'sposa@maisonaroma.it',
      phone: '+39 333 9988776',
      eventType: 'Matrimonio',
      eventDate: new Date('2026-09-15'),
      quantity: 180,
      budget: '€2.500 - €3.500',
      details: 'Desideriamo 180 bomboniere su misura in vaso ceramico fatto a mano con nastro verde salvia e fragranza personalizzata Fichi & Olivo.',
      status: 'NEW',
    },
  });

  console.log('✨ Seed complete successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
