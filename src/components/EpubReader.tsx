// src/components/EpubReader.tsx
"use client";
import React, { useEffect, useRef, useState } from 'react';
import ePub from 'epubjs';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface EpubReaderProps {
    epubUrl: string;
    bookId: string;
    title: string;
}

export default function EpubReader({ epubUrl, bookId, title }: EpubReaderProps) {
    const viewerRef = useRef<HTMLDivElement>(null);
    const [rendition, setRendition] = useState<any>(null);

    useEffect(() => {
        // Tarayıcı ortamında olduğumuzdan emin oluyoruz
        if (typeof window !== 'undefined' && viewerRef.current) {

            // Kitabı belleğe yükle
            const book = ePub(epubUrl);

            // Kitabı HTML içindeki div'e (viewerRef) bas
            const rend = book.renderTo(viewerRef.current, {
                width: '100%',
                height: '100%',
                spread: 'none', // Sayfaları tekli göster (mobil/web uyumu için)
            });

            rend.display();
            setRendition(rend);

            // Bileşen ekrandan kalktığında hafızayı temizle
            return () => {
                book.destroy();
            };
        }
    }, [epubUrl]);

    // Sayfa değiştirme fonksiyonları
    const next = () => rendition?.next();
    const prev = () => rendition?.prev();

    return (
        /* fixed ve z-[100] class'ları sayesinde bu ekran ana layout'taki sol menünün tamamen üzerine biner */
        <div className="fixed inset-0 z-[100] bg-[var(--background)] flex flex-col">

            {/* ÜST BAR (Kontrol Paneli) */}
            <div className="h-16 border-b border-[#222] bg-[#0a0a0a] flex items-center justify-between px-6 shrink-0 shadow-md">
                <Link
                    href={`/book/${bookId}`}
                    className="flex items-center gap-2 text-[var(--text-muted)] hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} /> <span className="font-medium hidden md:block">Kitaba Dön</span>
                </Link>
                <div className="font-bold text-white text-lg tracking-wide">{title}</div>
                <div className="w-24"></div> {/* Başlığı tam ortalamak için boşluk koruyucu */}
            </div>

            {/* OKUMA ALANI */}
            <div className="flex-1 relative flex items-center justify-center bg-[#141414]">

                {/* Sol Sayfa Butonu */}
                <button
                    onClick={prev}
                    className="absolute left-2 md:left-8 z-10 p-3 bg-black/40 text-white rounded-full hover:bg-[var(--accent)] hover:scale-110 transition-all backdrop-blur-sm border border-white/10"
                >
                    <ChevronLeft size={32} />
                </button>

                {/* E-kitabın iframe olarak render edileceği beyaz sayfa */}
                <div
                    ref={viewerRef}
                    className="w-full max-w-3xl h-[85vh] bg-[#fdfdfd] rounded-sm shadow-2xl overflow-hidden"
                />

                {/* Sağ Sayfa Butonu */}
                <button
                    onClick={next}
                    className="absolute right-2 md:right-8 z-10 p-3 bg-black/40 text-white rounded-full hover:bg-[var(--accent)] hover:scale-110 transition-all backdrop-blur-sm border border-white/10"
                >
                    <ChevronRight size={32} />
                </button>

            </div>
        </div>
    );
}