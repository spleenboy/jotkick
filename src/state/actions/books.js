import path from 'path';
import slug from 'slug';
import matter from 'gray-matter';

import * as Model from '../model';
import FileWalker from '../../storage/file-walker';
import File from '../../storage/file';

export function select(tree, book) {
    const books = tree.select('books');
    books.get().forEach((b, i) => {
        var bookCursor = books.select(i);
        if (b.id === book.id) {
            bookCursor.set('active', true);
        } else {
            // Inactive books are cleared of notes
            bookCursor.set('active', false);
            bookCursor.set('notes', []);
        }
    });
    loadNotes(tree, book);
};

export function setTitle(tree, book, title) {
    const cursor = tree.select('books', {id: book.id});
    cursor.set('title', title);
    cursor.set('name', slug(title));
};

export function create(tree, name) {
    // Create the file directory first
    const basePath = tree.get('settings', 'basePath');

    let bookDir = new File(path.join(basePath, name));
    let attempt = 1;

    while (bookDir.exists()) {
        bookDir = new File(path.join(basePath, `${name}-${attempt}`));
        attempt++;
    }

    bookDir.create();

    // Only add the book on success
    bookDir.on('created', () => {
        const book = Model.Book();
        book.name = name;

        const books = tree.select('books');
        books.get().forEach((b, i) => {
            books.set([i, 'active'], false);
        });

        book.active = true;
        books.push(book);
    });
};


/**
 * Scans the basePath for directories
**/
export function loadBooks(tree) {
    const basePath = tree.get('settings', 'basePath');
    const walker = new FileWalker(basePath);
    walker.depth = 1;
}


/**
 * Loads up the notes for the book
**/
export function loadNotes(tree, book) {
    const cursor = tree.select('books', {id: book.id});
    let baseDir = tree.get('settings', 'basePath');
    baseDir = path.join(baseDir, book.name);

    const walker = new FileWalker(baseDir);

    walker.on('file', (file) => {
        const note = matter(file.content, 'content');
        note.file  = file;
        if (note) {
            cursor.push('notes', note);
        } else {
            console.error("Could not parse file", file);
        }
    });

    walker.run(true);
};
