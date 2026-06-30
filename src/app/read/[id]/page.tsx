// src/app/read/[id]/page.tsx
import { promises as fs } from 'fs';
import path from 'path';
import { Book } from '@/types/book';
import { notFound } from 'next/navigation';
import EpubReader from '@/components/EpubReader';

// params'ın tipini Promise olarak belirtiyoruz
export default async function ReadPage({ params }: { params: Promise<{ id: string }> }) {
    // params'ı await ile çözümlüyoruz
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const dataPath = path.join(process.cwd(), 'public', 'data', 'books.json');
    const fileContents = await fs.readFile(dataPath, 'utf8');
    const books: Book[] = JSON.parse(fileContents);

    // params.id yerine id kullanıyoruz
    const book = books.find((b) => b.id === id);

    if (!book) {
        notFound();
    }

    return (
        <EpubReader
            epubUrl={`/data/epubs/${book.epub_file}`}
            bookId={book.id}
            title={book.title}
        />
    );
}