// src/components/ContinueReadingShelf.tsx
"use client";
import { useEffect, useState } from 'react';
import { Book } from '@/types/book';
import BookCard from './BookCard';
import { Clock } from 'lucide-react';

export default function ContinueReadingShelf({ books }: { books: Book[] }) {
    const [readingBooks, setReadingBooks] = useState<Book[]>([]);

    useEffect(() => {
        // Tarayıcı yüklendiğinde LocalStorage'ı tarayıp, kullanıcının okumakta olduğu kitapları buluyoruz
        const foundBooks = books.filter(book => {
            return localStorage.getItem(`mark_progress_${book.id}`) !== null;
        });

        // En son okunanı en başa almak için listeyi tersine çeviriyoruz (Basit bir varsayım)
        setReadingBooks(foundBooks.reverse());
    }, [books]);

    // Eğer kullanıcının okuduğu hiçbir kitap yoksa, bu rafı hiç gösterme (gizle)
    if (readingBooks.length === 0) return null;

    return (
        <div className="flex flex-col gap-4 mb-12 w-full relative bg-[#1a1a1a] py-8 border-y border-[#333] shadow-inner">
            <h2 className="text-xl font-bold text-white px-8 flex items-center gap-3">
                <Clock className="text-[var(--accent)]" size={24} /> Okumaya Devam Et
            </h2>

            <div className="flex gap-6 overflow-x-auto px-8 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
                {readingBooks.map((book) => (
                    <BookCard key={`continue-${book.id}`} book={book} />
                ))}
            </div>
        </div>
    );
}