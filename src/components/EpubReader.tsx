// src/components/EpubReader.tsx
"use client";
import React, { useEffect, useRef, useState } from 'react';
import ePub from 'epubjs';
import { ArrowLeft, ChevronLeft, ChevronRight, Settings, Minus, Plus, BookmarkCheck } from 'lucide-react';
import Link from 'next/link';

interface EpubReaderProps {
    epubUrl: string;
    bookId: string;
    title: string;
}

export default function EpubReader({ epubUrl, bookId, title }: EpubReaderProps) {
    const viewerRef = useRef<HTMLDivElement>(null);
    const [rendition, setRendition] = useState<any>(null);

    // Ekranda "Kaydedildi" animasyonu göstermek için yeni state
    const [showSavedToast, setShowSavedToast] = useState(false);

    // KİŞİSELLEŞTİRME MENÜSÜ STATE'LERİ
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [fontSize, setFontSize] = useState(100);
    const [currentTheme, setCurrentTheme] = useState('light');
    const [fontFamily, setFontFamily] = useState('serif');

    useEffect(() => {
        if (typeof window !== 'undefined' && viewerRef.current) {
            const book = ePub(epubUrl);

            const rend = book.renderTo(viewerRef.current, {
                width: '100%',
                height: '100%',
                spread: 'none',
            });

            rend.themes.register("light", { body: { background: "#fdfdfd", color: "#111111" }});
            rend.themes.register("dark", { body: { background: "#141414", color: "#f5f5f7" }});
            rend.themes.register("sepia", { body: { background: "#f4ecd8", color: "#5b4636" }});

            rend.themes.select(currentTheme);
            rend.themes.fontSize(`${fontSize}%`);
            rend.themes.font(fontFamily);

            // --- YENİ EKLENEN HAFIZA (CFI) SİSTEMİ ---

            // 1. Önce hafızada (localStorage) bu kitap için bir kayıt var mı diye bakıyoruz
            const savedCfi = localStorage.getItem(`mark_progress_${bookId}`);

            if (savedCfi) {
                // Kayıt varsa motoru doğrudan o koordinattan başlat
                rend.display(savedCfi);
            } else {
                // Kayıt yoksa kitabı en baştan başlat
                rend.display();
            }

            // 2. Kullanıcı her sayfa değiştirdiğinde yeni konumu kaydet
            rend.on('relocated', (location: any) => {
                const currentCfi = location.start.cfi;
                localStorage.setItem(`mark_progress_${bookId}`, currentCfi);

                // Sağ üstte minik bir "Kaydedildi" ikonu yakıp söndürmek için
                setShowSavedToast(true);
                setTimeout(() => setShowSavedToast(false), 2000);
            });

            setRendition(rend);

            return () => {
                book.destroy();
            };
        }
    }, [epubUrl, bookId]);

    // --- DEĞİŞİKLİK FONKSİYONLARI ---
    const changeTheme = (theme: string) => {
        setCurrentTheme(theme);
        rendition?.themes.select(theme);
    };

    const changeFontSize = (amount: number) => {
        const newSize = Math.max(50, Math.min(200, fontSize + amount));
        setFontSize(newSize);
        rendition?.themes.fontSize(`${newSize}%`);
    };

    const changeFontFamily = (font: string) => {
        setFontFamily(font);
        rendition?.themes.font(font);
    };

    const next = () => rendition?.next();
    const prev = () => rendition?.prev();

    const getOuterBgColor = () => {
        if (currentTheme === 'dark') return 'bg-[#111111]';
        if (currentTheme === 'sepia') return 'bg-[#e8dcb8]';
        return 'bg-[#f0f0f0]';
    };

    const getPaperBgColor = () => {
        if (currentTheme === 'dark') return 'bg-[#141414]';
        if (currentTheme === 'sepia') return 'bg-[#f4ecd8]';
        return 'bg-[#fdfdfd]';
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[var(--background)] flex flex-col">

            <div className="h-16 border-b border-[#222] bg-[#0a0a0a] flex items-center justify-between px-6 shrink-0 shadow-md relative z-50">
                <Link href={`/book/${bookId}`} className="flex items-center gap-2 text-[var(--text-muted)] hover:text-white transition-colors">
                    <ArrowLeft size={20} /> <span className="font-medium hidden md:block">Kitaba Dön</span>
                </Link>
                <div className="font-bold text-white text-lg tracking-wide">{title}</div>

                <div className="flex items-center gap-4">
                    {/* KAYDEDİLDİ BİLDİRİMİ (TOAST) */}
                    <div className={`flex items-center gap-1 text-green-500 text-xs font-bold transition-opacity duration-500 ${showSavedToast ? 'opacity-100' : 'opacity-0'}`}>
                        <BookmarkCheck size={16} /> Konum Kaydedildi
                    </div>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`p-2 rounded-full transition-all duration-300 ${isMenuOpen ? 'bg-[var(--accent)] text-white rotate-90' : 'text-[var(--text-muted)] hover:text-white hover:bg-[#222]'}`}
                    >
                        <Settings size={20} />
                    </button>
                </div>

                {isMenuOpen && (
                    <div className="absolute top-20 right-6 w-80 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-2xl p-6 flex flex-col gap-6 text-white animate-in fade-in slide-in-from-top-4">

                        <div className="flex flex-col gap-3">
                            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold">Arka Plan</span>
                            <div className="flex gap-2">
                                <button onClick={() => changeTheme('light')} className={`flex-1 py-2.5 rounded-md font-medium border transition-colors ${currentTheme === 'light' ? 'bg-white text-black border-white' : 'bg-transparent text-white border-[#444] hover:border-white'}`}>Gündüz</button>
                                <button onClick={() => changeTheme('sepia')} className={`flex-1 py-2.5 rounded-md font-medium border transition-colors ${currentTheme === 'sepia' ? 'bg-[#f4ecd8] text-[#5b4636] border-[#f4ecd8]' : 'bg-transparent text-white border-[#444] hover:border-[#f4ecd8]'}`}>Sepya</button>
                                <button onClick={() => changeTheme('dark')} className={`flex-1 py-2.5 rounded-md font-medium border transition-colors ${currentTheme === 'dark' ? 'bg-[#222] text-white border-white' : 'bg-transparent text-white border-[#444] hover:border-white'}`}>Gece</button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold">Yazı Tipi</span>
                            <div className="flex gap-2">
                                <button onClick={() => changeFontFamily('serif')} className={`flex-1 py-2.5 rounded-md font-serif border transition-colors ${fontFamily === 'serif' ? 'bg-[#333] border-[#555]' : 'border-[#333] hover:border-[#555]'}`}>Klasik</button>
                                <button onClick={() => changeFontFamily('sans-serif')} className={`flex-1 py-2.5 rounded-md font-sans border transition-colors ${fontFamily === 'sans-serif' ? 'bg-[#333] border-[#555]' : 'border-[#333] hover:border-[#555]'}`}>Modern</button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold">Yazı Boyutu</span>
                            <div className="flex items-center justify-between bg-[#222] rounded-md p-1.5 border border-[#333]">
                                <button onClick={() => changeFontSize(-10)} className="p-2 hover:bg-[#444] rounded-md transition-colors"><Minus size={18} /></button>
                                <span className="font-medium text-lg">{fontSize}%</span>
                                <button onClick={() => changeFontSize(10)} className="p-2 hover:bg-[#444] rounded-md transition-colors"><Plus size={18} /></button>
                            </div>
                        </div>

                    </div>
                )}
            </div>

            <div className={`flex-1 relative flex items-center justify-center transition-colors duration-500 ${getOuterBgColor()}`}>

                <button onClick={prev} className="absolute left-2 md:left-8 z-10 p-3 bg-black/40 text-white rounded-full hover:bg-[var(--accent)] hover:scale-110 transition-all backdrop-blur-sm border border-white/10">
                    <ChevronLeft size={32} />
                </button>

                <div
                    ref={viewerRef}
                    className={`w-full max-w-3xl h-[85vh] rounded-md shadow-2xl overflow-hidden transition-colors duration-500 ${getPaperBgColor()}`}
                />

                <button onClick={next} className="absolute right-2 md:right-8 z-10 p-3 bg-black/40 text-white rounded-full hover:bg-[var(--accent)] hover:scale-110 transition-all backdrop-blur-sm border border-white/10">
                    <ChevronRight size={32} />
                </button>

            </div>
        </div>
    );
}