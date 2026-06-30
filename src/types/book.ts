// src/types/book.ts

export interface Book {
    id: string;
    title: string;
    original_title: string;
    slug: string;
    author: string;
    translator: string | null;
    publisher: string;
    publish_year: number;
    page_count: number;
    estimated_reading_time_minutes: number;
    category: string;
    isbn: string;
    cover_image: string;
    epub_file: string;
    description: string;
}