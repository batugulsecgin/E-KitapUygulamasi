// src/app/book/[id]/page.tsx
import { promises as fs } from 'fs';
import path from 'path';
import { Book } from '@/types/book';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Play, ArrowLeft, BookOpen, Clock, Calendar } from 'lucide-react';

// params'ın tipini Promise olarak belirtiyoruz
export default async function BookDetail({ params }: { params: Promise<{ id: string }> }) {
    // 1. Yeni Next.js kuralları gereği params'ı await ile çözümlüyoruz
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const dataPath = path.join(process.cwd(), 'public', 'data', 'books.json');
    const fileContents = await fs.readFile(dataPath, 'utf8');
    const books: Book[] = JSON.parse(fileContents);

    // Artık params.id yerine direkt id kullanıyoruz
    const book = books.find((b) => b.id === id);

    // Kitap bulunamazsa 404 sayfasına yönlendir
    if (!book) {
        notFound();
    }

    // Tahmini okuma süresini saate çevirme
    const readingHours = Math.round(book.estimated_reading_time_minutes / 60);

    return (
        <div className="min-h-screen bg-[var(--background)] p-8 md:p-12">
            {/* Geri Dön Butonu */}
            <Link href="/" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-white transition-colors mb-8">
                <ArrowLeft size={20} /> Ana Sayfaya Dön
            </Link>

            <div className="flex flex-col md:flex-row gap-12 max-w-6xl mx-auto mt-4">

                {/* SOL BLOK: Kapak ve Ana Aksiyon */}
                <div className="flex flex-col gap-6 w-full md:w-1/3 max-w-[300px] shrink-0">
                    <div className="aspect-[2/3] w-full rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-neutral-800">
                        <img
                            src={`/data/covers/${book.cover_image}`}
                            alt={book.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Okuma sayfasına gidecek buton */}
                    <Link
                        href={`/read/${book.id}`}
                        className="flex items-center justify-center gap-2 bg-white text-black py-4 rounded-lg font-bold text-lg hover:scale-105 transition-transform w-full shadow-lg"
                    >
                        <Play size={24} className="fill-black" /> Hemen Oku
                    </Link>
                </div>

                {/* SAĞ BLOK: Kitap Künyesi ve Detaylar */}
                <div className="flex flex-col w-full">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-2">{book.title}</h1>
                    <h2 className="text-xl text-[var(--text-muted)] mb-8 font-serif italic">{book.original_title}</h2>

                    {/* İstenilen Detaylı Künye Grid'i */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-neutral-800 mb-8">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-neutral-500 uppercase tracking-wider">Yazar</span>
                            <span className="text-white font-medium">{book.author}</span>
                        </div>

                        {/* Çevirmen varsa göster, yoksa (null ise) bu bloğu render etme */}
                        {book.translator && (
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-neutral-500 uppercase tracking-wider">Çevirmen</span>
                                <span className="text-white font-medium">{book.translator}</span>
                            </div>
                        )}

                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-neutral-500 uppercase tracking-wider">Yayınevi</span>
                            <span className="text-white font-medium">{book.publisher}</span>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-neutral-500 uppercase tracking-wider">Tür</span>
                            <span className="text-white font-medium">{book.category}</span>
                        </div>
                    </div>

                    {/* Ekstra İstatistikler */}
                    <div className="flex gap-6 mb-10 text-sm text-[var(--text-muted)]">
                        <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1.5 rounded-full border border-neutral-800">
                            <Calendar size={16} /> {book.publish_year}
                        </div>
                        <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1.5 rounded-full border border-neutral-800">
                            <BookOpen size={16} /> {book.page_count} Sayfa
                        </div>
                        <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1.5 rounded-full border border-neutral-800">
                            <Clock size={16} /> ~{readingHours} Saat Okuma
                        </div>
                    </div>

                    {/* Kitap Özeti */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-lg font-bold text-white">Kitap Hakkında</h3>
                        <p className="text-neutral-300 leading-relaxed text-lg">
                            {book.description}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}