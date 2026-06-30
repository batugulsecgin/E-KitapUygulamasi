// src/app/search/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import BookCard from '@/components/BookCard';
import { Search as SearchIcon, X } from 'lucide-react';

export default function SearchPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Book[]>([]);

    // 1. Sayfa yüklendiğinde public klasöründeki JSON'ı çekiyoruz
    useEffect(() => {
        fetch('/data/books.json')
            .then((res) => res.json())
            .then((data: Book[]) => {
                setBooks(data);
                setResults(data); // İlk açılışta tüm kitapları göster
            })
            .catch((err) => console.error("Veri çekilemedi:", err));
    }, []);

    // 2. Kullanıcı her harf yazdığında filtreleme yapan akıllı arama motoru
    useEffect(() => {
        if (!query.trim()) {
            setResults(books); // Arama kutusu boşsa hepsini göster
            return;
        }

        // Türkçe karakter (ı, i, ş, vb.) uyumu için toLocaleLowerCase kullanıyoruz
        const lowerQuery = query.toLocaleLowerCase('tr-TR');

        const filtered = books.filter((book) => {
            return (
                book.title.toLocaleLowerCase('tr-TR').includes(lowerQuery) ||
                book.author.toLocaleLowerCase('tr-TR').includes(lowerQuery) ||
                book.publisher.toLocaleLowerCase('tr-TR').includes(lowerQuery) ||
                // Çevirmen null (boş) olabileceği için önce var mı diye kontrol ediyoruz
                (book.translator && book.translator.toLocaleLowerCase('tr-TR').includes(lowerQuery))
            );
        });

        setResults(filtered);
    }, [query, books]);

    return (
        <div className="min-h-screen bg-[var(--background)] p-8 md:p-12">
            <div className="max-w-6xl mx-auto flex flex-col gap-10">

                {/* ARAMA ÇUBUĞU (Büyük ve Şık Tasarım) */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-white transition-colors">
                        <SearchIcon size={28} />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Kitap, yazar, çevirmen veya yayınevi ara..."
                        className="w-full bg-[#1a1a1a] border-2 border-[#333] text-white text-xl rounded-full py-5 pl-16 pr-12 outline-none focus:border-[var(--accent)] focus:bg-[#222] transition-all shadow-xl placeholder:text-neutral-500"
                    />
                    {/* Çarpı butonu (Yazıyı hızlıca silmek için) */}
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            className="absolute inset-y-0 right-6 flex items-center text-neutral-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    )}
                </div>

                {/* SONUÇLAR ALANI */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        {query ? (
                            <span><span className="text-[var(--accent)]">"{query}"</span> için {results.length} sonuç bulundu</span>
                        ) : (
                            <span>Tüm Kütüphane</span>
                        )}
                    </h2>

                    {results.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-10 gap-x-6">
                            {results.map((book) => (
                                <div key={book.id} className="flex justify-center">
                                    <BookCard book={book} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Sonuç bulunamadığında gösterilecek tatlı bir boş state ekranı
                        <div className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-[#111] rounded-2xl border border-[#222]">
                            <SearchIcon size={48} className="text-neutral-600 mb-2" />
                            <h3 className="text-2xl font-bold text-white">Sonuç Bulunamadı</h3>
                            <p className="text-[var(--text-muted)] max-w-md">
                                Aradığınız kriterlere uygun bir kitap kütüphanemizde yer almıyor. Başka bir yazar veya kitap adıyla tekrar deneyebilirsiniz.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}