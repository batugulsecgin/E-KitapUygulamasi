// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Home, Search, BookOpen, Compass, User } from "lucide-react";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Mark - Dijital Kütüphane",
  description: "Abonelik tabanlı Türkçe e-kitap platformu",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="tr">
      <body>
      <div className="flex h-screen w-full overflow-hidden">

        {/* SIDEBAR (SOL MENÜ) */}
        <aside className="w-64 bg-[var(--sidebar)] flex flex-col justify-between p-6 border-r border-[#222] shrink-0 hidden md:flex">
          <div className="flex flex-col gap-8">
            {/* Logo alanı */}
            <div className="text-[var(--accent)] font-black text-3xl tracking-wider select-none px-2">
              mark.
            </div>

            {/* Menü Linkleri */}
            <nav className="flex flex-col gap-2">
              <button className="flex items-center gap-4 text-white font-medium px-3 py-2.5 rounded-lg bg-[#1a1a1a] transition-all w-full text-left">
                <Home size={20} className="text-[var(--accent)]" /> Ana Sayfa
              </button>
              <Link href="/search" className="flex items-center gap-4 text-[var(--text-muted)] hover:text-white font-medium px-3 py-2.5 rounded-lg hover:bg-[#111] transition-all w-full text-left">
                <Search size={20} /> Kitap Ara
              </Link>
              <button className="flex items-center gap-4 text-[var(--text-muted)] hover:text-white font-medium px-3 py-2.5 rounded-lg hover:bg-[#111] transition-all w-full text-left">
                <Compass size={20} /> Keşfet
              </button>
              <button className="flex items-center gap-4 text-[var(--text-muted)] hover:text-white font-medium px-3 py-2.5 rounded-lg hover:bg-[#111] transition-all w-full text-left">
                <BookOpen size={20} /> Kitaplığım
              </button>
            </nav>
          </div>

          {/* Profil İllüzyonu (Alt Kısım) */}
          <div className="flex items-center gap-3 p-2 bg-[#111] rounded-xl border border-[#222]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              TB
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">Tolga Batu</span>
              <span className="text-xs text-[var(--text-muted)]">Premium Üye</span>
            </div>
          </div>
        </aside>

        {/* SAĞ TARAF: HEADER + ANA İÇERİK */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* STICKY HEADER */}
          <header className="h-16 border-b border-[#222] bg-[var(--background)] flex items-center justify-between px-8 shrink-0">
            <div className="text-sm font-medium text-[var(--text-muted)]">
              Hoş geldin, bugün ne okumak istersin?
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold hover:bg-neutral-200 transition-all">
                Planı Yönet
              </button>
              <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-[var(--text-muted)] md:hidden">
                <User size={16} />
              </div>
            </div>
          </header>

          {/* SAYFA İÇERİĞİ (KAYDIRILABİLİR ALAN) */}
          <main className="flex-1 overflow-y-auto bg-[var(--background)]">
            {children}
          </main>
        </div>

      </div>
      </body>
      </html>
  );
}