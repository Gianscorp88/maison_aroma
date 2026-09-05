'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Key, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push(data.redirectUrl || '/admin');
        router.refresh();
      } else {
        setError(data.error || 'Credenziali non valide. Riprova.');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('Errore di connessione al server. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Subtle Background Glow Effect */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-sm p-8 sm:p-10 shadow-2xl space-y-8 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-block pb-2">
            <span className="font-serif text-2xl font-bold tracking-wider text-amber-500">
              MAISON AROMA
            </span>
            <span className="block text-[9px] uppercase tracking-[0.3em] text-neutral-400">
              Atelier & Parfumerie
            </span>
          </div>

          <div className="flex items-center justify-center space-x-2 text-xs uppercase tracking-widest text-neutral-400 border-t border-b border-neutral-800 py-2">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Accesso Riservato Amministrazione</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xs flex items-start space-x-3 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div className="space-y-1.5">
            <label className="block font-bold uppercase tracking-wider text-neutral-300">
              Username / Email Admin
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@maisonaroma.it"
                className="w-full pl-10 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 text-white rounded-xs focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold uppercase tracking-wider text-neutral-300">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                <Key className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 text-white rounded-xs focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 text-neutral-950 font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors rounded-xs flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
          >
            <span>{loading ? 'Verifica credenziali...' : 'Accedi al Backoffice'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security Notice */}
        <div className="text-center text-[10px] text-neutral-500 font-mono">
          🔒 Connessione Crittografata Server-Side
        </div>
      </div>
    </div>
  );
}
