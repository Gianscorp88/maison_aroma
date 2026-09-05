import fs from 'fs';
import path from 'path';

export interface EmailRecord {
  id: string;
  to: string;
  subject: string;
  type: 'ORDER_CONFIRMATION' | 'STATUS_UPDATE' | 'PROOF_SENT';
  orderNumber: string;
  contentHtml: string;
  sentAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const EMAILS_FILE = path.join(DATA_DIR, 'sent-emails.json');

export function getSentEmails(): EmailRecord[] {
  try {
    if (fs.existsSync(EMAILS_FILE)) {
      const data = fs.readFileSync(EMAILS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading sent-emails.json:', err);
  }
  return [];
}

export function saveSentEmail(record: EmailRecord) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const emails = getSentEmails();
    emails.unshift(record);
    fs.writeFileSync(EMAILS_FILE, JSON.stringify(emails, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving sent email:', err);
  }
}

export async function sendOrderConfirmationEmail(orderData: any) {
  const subject = `Conferma Ordine #${orderData.orderNumber} — Maison Aroma`;
  const itemsList = (orderData.items || []).map((i: any) => {
    let custom: any = {};
    try {
      custom = typeof i.customization === 'string' ? JSON.parse(i.customization) : i.customization || {};
    } catch (e) {}
    
    const details = [];
    if (custom.fragrance) details.push(`Fragranza: ${custom.fragrance}`);
    if (custom.ribbonColor) details.push(`Nastro: ${custom.ribbonColor}`);
    if (custom.packaging) details.push(`Packaging: ${custom.packaging}`);
    if (custom.namesText) details.push(`Nomi: "${custom.namesText}"`);
    if (custom.dateText) details.push(`Data: ${custom.dateText}`);
    
    const customText = details.join(' • ');

    return `<li><strong>${i.product?.name || i.name || 'Candela Personalizzata'}</strong> - Q.tà: ${i.quantity} pz - €${((i.unitPrice || 0) * i.quantity).toFixed(2)} ${customText ? `<br/><small style="color: #786C66;">${customText}</small>` : ''}</li>`;
  }).join('');

  const html = `
    <div style="font-family: serif; color: #2C1810; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #EAE0D5; background: #FAF8F5;">
      <h2 style="color: #C5A059; text-align: center;">Maison Aroma — Profumi di Casa</h2>
      <hr style="border: 0; border-top: 1px solid #EAE0D5;" />
      <h3>Grazie per il tuo ordine, ${orderData.customerName}!</h3>
      <p>Il tuo ordine <strong>#${orderData.orderNumber}</strong> è stato ricevuto con successo ed è in fase di presa in carico.</p>
      
      <h4>Riepilogo Ordine:</h4>
      <ul>${itemsList}</ul>
      
      <p><strong>Totale Calcolato:</strong> €${orderData.totalAmount.toFixed(2)}</p>
      <p><strong>Metodo di Pagamento:</strong> ${orderData.paymentMethod}</p>
      <p><strong>Stato Iniziale Ordine:</strong> ${orderData.status}</p>
      
      <hr style="border: 0; border-top: 1px solid #EAE0D5;" />
      <p style="font-size: 11px; color: #786C66; text-align: center;">Maison Aroma • Haute Parfumerie & Candele Artigianali</p>
    </div>
  `;

  const record: EmailRecord = {
    id: `eml_${Date.now()}`,
    to: orderData.customerEmail,
    subject,
    type: 'ORDER_CONFIRMATION',
    orderNumber: orderData.orderNumber,
    contentHtml: html,
    sentAt: new Date().toISOString(),
  };

  console.log(`\n📧 [EMAIL CONFIRMATION SENT TO: ${orderData.customerEmail}] — Order #${orderData.orderNumber}`);
  saveSentEmail(record);
  return record;
}

export async function sendOrderStatusUpdateEmail(orderData: any, newStatus: string) {
  const subject = `Aggiornamento Ordine #${orderData.orderNumber} — Stato: ${newStatus}`;
  const html = `
    <div style="font-family: serif; color: #2C1810; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #EAE0D5; background: #FAF8F5;">
      <h2 style="color: #C5A059; text-align: center;">Maison Aroma — Aggiornamento Ordine</h2>
      <hr style="border: 0; border-top: 1px solid #EAE0D5;" />
      <h3>Gentile ${orderData.customerName},</h3>
      <p>Ti informiamo che lo stato del tuo ordine <strong>#${orderData.orderNumber}</strong> è stato aggiornato in:</p>
      <p style="font-size: 18px; font-weight: bold; color: #C5A059; text-align: center; padding: 10px; background: #fff; border: 1px solid #EAE0D5;">${newStatus}</p>
      <p>Puoi consultare lo storico dei tuoi ordini accedendo alla tua area personale con il tuo indirizzo email.</p>
      <hr style="border: 0; border-top: 1px solid #EAE0D5;" />
      <p style="font-size: 11px; color: #786C66; text-align: center;">Maison Aroma • Servizio Clienti</p>
    </div>
  `;

  const record: EmailRecord = {
    id: `eml_${Date.now()}`,
    to: orderData.customerEmail,
    subject,
    type: 'STATUS_UPDATE',
    orderNumber: orderData.orderNumber,
    contentHtml: html,
    sentAt: new Date().toISOString(),
  };

  console.log(`\n📧 [EMAIL STATUS UPDATE SENT TO: ${orderData.customerEmail}] — Order #${orderData.orderNumber} -> Status: ${newStatus}`);
  saveSentEmail(record);
  return record;
}

export async function sendProofEmail(orderData: any, proofUrl: string, proofNotes: string) {
  const subject = `Bozza Grafica Etichetta per Ordine #${orderData.orderNumber} — Maison Aroma`;
  const html = `
    <div style="font-family: serif; color: #2C1810; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #EAE0D5; background: #FAF8F5;">
      <h2 style="color: #C5A059; text-align: center;">Maison Aroma — Bozza Grafica</h2>
      <hr style="border: 0; border-top: 1px solid #EAE0D5;" />
      <h3>Gentile ${orderData.customerName},</h3>
      <p>Ecco la bozza grafica elaborata per il tuo ordine <strong>#${orderData.orderNumber}</strong>:</p>
      <div style="text-align: center; margin: 20px 0;">
        <img src="${proofUrl}" alt="Bozza Grafica" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px;" />
      </div>
      ${proofNotes ? `<p><strong>Note del Grafico:</strong> <em>"${proofNotes}"</em></p>` : ''}
      <p>Per eventuali modifiche o conferme, rispondi semplicemente a questa email.</p>
      <hr style="border: 0; border-top: 1px solid #EAE0D5;" />
      <p style="font-size: 11px; color: #786C66; text-align: center;">Maison Aroma • Laboratorio Grafico</p>
    </div>
  `;

  const record: EmailRecord = {
    id: `eml_${Date.now()}`,
    to: orderData.customerEmail,
    subject,
    type: 'PROOF_SENT',
    orderNumber: orderData.orderNumber,
    contentHtml: html,
    sentAt: new Date().toISOString(),
  };

  console.log(`\n📧 [EMAIL PROOF SENT TO: ${orderData.customerEmail}] — Order #${orderData.orderNumber}`);
  saveSentEmail(record);
  return record;
}
