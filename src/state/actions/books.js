import path from 'path';
import slug from 'slug';
import matter from 'gray-matter';
import uuid from 'uuid';

import * as Model from '../model';
import FileWalker from '../../storage/file-walker';
import File from '../../storage/file';

export function select(tree, book, callback = null) {
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
    tree.set(['settings', 'lastBook'], book.name);
    loadNotes(tree, book, callback);
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

    bookDir.mkdirs();

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
export function loadBooks(tree, callback = null) {
    const basePath = tree.get('settings', 'basePath');
    const books = tree.select('books');

    const walker = new FileWalker(basePath);

    walker.depth = 0;
    walker.on('dir', (dir) => {
        if (books.get({name: dir.path.name})) {
            // Skip existing book
            return;
        }
        const found = Model.Book();
        found.name = dir.path.name;
        books.push(found);
    });

    if (callback) walker.on('done', callback);
    walker.run();
}


/**
 * Loads up the notes for the book
**/
export function loadNotes(tree, book, callback = null) {
    const cursor = tree.select('books', {id: book.id});
    let baseDir = tree.get('settings', 'basePath');
    baseDir = path.join(baseDir, book.name);

    const walker = new FileWalker(baseDir);
    const isNote = (file) => file.path.ext === '.md';

    walker.on('file', (file) => {
        if (!isNote(file)) {
            return;
        }
        let note = matter(file.content || "");
        if (note) {
            note.id   = uuid();
            note.file = file;
            if (!note.data.title) {
                note.data.title = file.path.name;
            }
            cursor.push('notes', note);
        } else {
            console.error("Could not parse file", file);
        }
    });

    if (callback) walker.on('done', callback);

    cursor.set('notes', []);
    tree.commit();
    walker.run(isNote);
};
