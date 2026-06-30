// src/components/BookCard.tsx
import Link from 'next/link';
import { Book } from '@/types/book';

export default function BookCard({ book }: { book: Book }) {
    return (
        <Link
            href={`/book/${book.id}`}
            className="group flex flex-col gap-3 min-w-[140px] max-w-[140px] md:min-w-[160px] md:max-w-[160px] cursor-pointer snap-start"
        >
            {/* Kapak Görseli ve Hover Efekti */}
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-[#222] shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                {/* Kapak fotoğrafı bulunamazsa diye varsayılan gri bir arka plan */}
                <img
                    src={`/data/covers/${book.cover_image}`}
                    alt={book.title}
                    className="w-full h-full object-cover"
                />
                {/* Hover olunca kapağın üzerine gelen hafif karanlık katman */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>

            {/* Kitap Bilgileri */}
            <div className="flex flex-col">
                <h3 className="text-sm font-semibold text-white truncate">{book.title}</h3>
                <span className="text-xs text-[var(--text-muted)] truncate">{book.author}</span>
            </div>
        </Link>
    );
}