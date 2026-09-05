'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Flame, Image, Package, MessageSquare, LogOut, Sparkles, ArrowLeft, Settings } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, render children directly without admin sidebar wrapper
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Error during logout:', err);
      window.location.href = '/admin/login';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-neutral-950 border-r border-neutral-800 p-6 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-8">
          <div>
            <Link href="/admin" className="block">
              <span className="font-serif text-xl font-bold tracking-wider text-amber-500">
                MAISON AROMA
              </span>
              <span className="block text-[9px] uppercase tracking-[0.3em] text-neutral-400">
                Admin & Atelier Suite
              </span>
            </Link>
          </div>

          <nav className="space-y-1 text-xs uppercase tracking-wider font-semibold">
            <Link
              href="/admin"
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-sm hover:bg-neutral-800 transition-colors ${
                pathname === '/admin' ? 'bg-neutral-800 text-amber-500 font-bold' : 'text-neutral-300 hover:text-amber-500'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-amber-500" />
              <span>Overview KPIs</span>
            </Link>

            <Link
              href="/admin/products"
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-sm hover:bg-neutral-800 transition-colors ${
                pathname?.startsWith('/admin/products') ? 'bg-neutral-800 text-amber-500 font-bold' : 'text-neutral-300 hover:text-amber-500'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Prodotti</span>
            </Link>

            <Link
              href="/admin/categories"
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-sm hover:bg-neutral-800 transition-colors ${
                pathname?.startsWith('/admin/categories') ? 'bg-neutral-800 text-amber-500 font-bold' : 'text-neutral-300 hover:text-amber-500'
              }`}
            >
              <Package className="w-4 h-4 text-amber-500" />
              <span>Categorie (Collezioni & Eventi)</span>
            </Link>

            <Link
              href="/admin/fragrances"
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-sm hover:bg-neutral-800 transition-colors ${
                pathname?.startsWith('/admin/fragrances') ? 'bg-neutral-800 text-amber-500 font-bold' : 'text-neutral-300 hover:text-amber-500'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Fragranze</span>
            </Link>

            <Link
              href="/admin/customizer"
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-sm hover:bg-neutral-800 transition-colors ${
                pathname?.startsWith('/admin/customizer') ? 'bg-neutral-800 text-amber-500 font-bold' : 'text-neutral-300 hover:text-amber-500'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Crea la tua Candela</span>
            </Link>

            <Link
              href="/admin/orders"
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-sm hover:bg-neutral-800 transition-colors ${
                pathname?.startsWith('/admin/orders') ? 'bg-neutral-800 text-amber-500 font-bold' : 'text-neutral-300 hover:text-amber-500'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              <span>Gestione Ordini</span>
            </Link>

            <Link
              href="/admin/production"
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-sm hover:bg-neutral-800 transition-colors ${
                pathname?.startsWith('/admin/production') ? 'bg-neutral-800 text-amber-500 font-bold' : 'text-neutral-300 hover:text-amber-500'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Kanban Produzione</span>
            </Link>

            <Link
              href="/admin/proofs"
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-sm hover:bg-neutral-800 transition-colors ${
                pathname?.startsWith('/admin/proofs') ? 'bg-neutral-800 text-amber-500 font-bold' : 'text-neutral-300 hover:text-amber-500'
              }`}
            >
              <Image className="w-4 h-4 text-amber-500" />
              <span>Approvazione Bozze</span>
            </Link>

            <Link
              href="/admin/inventory"
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-sm hover:bg-neutral-800 transition-colors ${
                pathname?.startsWith('/admin/inventory') ? 'bg-neutral-800 text-amber-500 font-bold' : 'text-neutral-300 hover:text-amber-500'
              }`}
            >
              <Package className="w-4 h-4 text-amber-500" />
              <span>Magazzino & Materie</span>
            </Link>

            <Link
              href="/admin/quotes"
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-sm hover:bg-neutral-800 transition-colors ${
                pathname?.startsWith('/admin/quotes') ? 'bg-neutral-800 text-amber-500 font-bold' : 'text-neutral-300 hover:text-amber-500'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-amber-500" />
              <span>Preventivi Eventi</span>
            </Link>

            <Link
              href="/admin/settings"
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-sm hover:bg-neutral-800 transition-colors ${
                pathname?.startsWith('/admin/settings') ? 'bg-neutral-800 text-amber-500 font-bold' : 'text-neutral-300 hover:text-amber-500'
              }`}
            >
              <Settings className="w-4 h-4 text-amber-500" />
              <span>Impostazioni Shop</span>
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-neutral-800 space-y-3">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xs text-neutral-400 hover:text-amber-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Torna al Sito Pubblico</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-xs text-red-400 hover:text-red-300 transition-colors w-full text-left font-semibold pt-1"
          >
            <LogOut className="w-4 h-4" />
            <span>Esci (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
