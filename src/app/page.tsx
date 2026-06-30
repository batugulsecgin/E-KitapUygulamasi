// src/app/page.tsx
import { promises as fs } from 'fs';
import path from 'path';
import { Book } from '@/types/book';
import BookShelf from '@/components/BookShelf';
import { Play, Plus } from 'lucide-react';
import Link from 'next/link';
import ContinueReadingShelf from '@/components/ContinueReadingShelf';

export default async function Home() {
  // 1. JSON Verisini Okuma (Next.js Server Component gücüyle)
  const dataPath = path.join(process.cwd(), 'public', 'data', 'books.json');
  const fileContents = await fs.readFile(dataPath, 'utf8');
  const books: Book[] = JSON.parse(fileContents);

  // Öne çıkan kitap olarak Kürk Mantolu Madonna'yı (listede 1. sırada) alalım
  const featuredBook = books[0];

  return (
      <div className="pb-20">

        {/* HERO BANNER - En Üstteki Büyük Alan */}
        <div className="relative w-full h-[60vh] min-h-[450px] bg-neutral-900 mb-12 flex items-center border-b border-[#222] overflow-hidden">
          {/* Arka Plan Bulanık Efekti (Kitap kapağından renk alır) */}
          <div className="absolute inset-0 z-0 opacity-30">
            <img
                src={`/data/covers/${featuredBook.cover_image}`}
                alt="Arka plan"
                className="w-full h-full object-cover blur-3xl scale-110"
            />
          </div>
          {/* Karartma Gradien'i */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/80 to-transparent z-10" />

          <div className="relative z-20 flex gap-10 items-center px-8 md:px-16 max-w-7xl w-full">
            {/* Sadece mobilde gizlenen büyük kapak */}
            <div className="hidden md:block w-56 shrink-0 rounded-lg overflow-hidden shadow-2xl border border-neutral-700/50">
              <img src={`/data/covers/${featuredBook.cover_image}`} alt={featuredBook.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col gap-5 max-w-2xl">
            <span className="text-[var(--accent)] font-bold text-xs tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span> Editörün Seçimi
            </span>

              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                {featuredBook.title}
              </h1>

              <div className="flex items-center gap-4 text-sm font-medium text-[var(--text-muted)]">
                <span className="text-white">{featuredBook.publish_year}</span>
                <span>•</span>
                <span>{featuredBook.author}</span>
                <span>•</span>
                <span>{featuredBook.page_count} Sayfa</span>
              </div>

              <p className="text-[var(--text-muted)] text-base md:text-lg line-clamp-3">
                {featuredBook.description}
              </p>

              <div className="flex gap-4 mt-2">
                <Link href={`/book/${featuredBook.id}`} className="flex items-center justify-center gap-2 bg-white text-black px-6 md:px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform">
                  <Play size={20} className="fill-black" /> Hemen Oku
                </Link>
                <button className="flex items-center justify-center gap-2 bg-[#2a2a2a] text-white px-6 md:px-8 py-3 rounded-full font-bold hover:bg-[#333] transition-colors border border-[#444]">
                  <Plus size={20} /> Listeme Ekle
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ... Hero Banner Bitişi ... */}

        {/* KULLANICININ OKUDUĞU KİTAPLAR RAFI (Otomatik olarak gizlenir/gösterilir) */}
        <ContinueReadingShelf books={books} />

        {/* DİNAMİK RAFLAR */}

        {/* 1. Raf: İlk 5 kitap */}
        <BookShelf title="Popüler Romanlar" books={books.slice(0, 4)} />

        {/* 2. Raf: Yılı 1900'den eski olanlar (Tanzimat/Servet-i Fünun) */}
        <BookShelf title="Klasiklere Yolculuk" books={books.filter(b => b.publish_year < 1900)} />

        {/* 3. Raf: Sayfa sayısı 150'den az olanlar */}
        <BookShelf title="Kısa Sürede Bitecekler" books={books.filter(b => b.page_count < 150)} />

        {/* 4. Raf: Karışık geri kalanlar */}
        <BookShelf title="Sizin İçin Seçtiklerimiz" books={books.slice(4, 10).reverse()} />

      </div>
  );
}