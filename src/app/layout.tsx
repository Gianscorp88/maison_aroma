import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { ShopSettingsProvider } from '@/context/ShopSettingsContext';

export const metadata: Metadata = {
  title: 'Maison Aroma Creazioni | Candele Artigianali & Bomboniere di Lusso',
  description: 'Candele sartoriali personalizzate per matrimoni, battesimi ed eventi di lusso. Cera di soia 100% naturale colata a mano in Italia con fragranze d’autore.',
  keywords: ['candele personalizzate', 'bomboniere matrimonio', 'candele profumate matrimonio', 'bomboniere battesimo', 'candele luxury', 'maison aroma'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="min-h-screen flex flex-col bg-brand-ivory text-brand-espresso antialiased">
        <ShopSettingsProvider>
          <Header />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </ShopSettingsProvider>
      </body>
    </html>
  );
}
