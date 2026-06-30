// src/components/BookShelf.tsx
import BookCard from './BookCard';
import { Book } from '@/types/book';

interface BookShelfProps {
    title: string;
    books: Book[];
}

export default function BookShelf({ title, books }: BookShelfProps) {
    if (!books || books.length === 0) return null;

    return (
        <div className="flex flex-col gap-4 mb-12 w-full relative">
            <h2 className="text-xl font-bold text-white px-8">{title}</h2>

            {/* Yatay Kaydırılabilir Alan */}
            <div className="flex gap-6 overflow-x-auto px-8 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
                {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>
        </div>
    );
}