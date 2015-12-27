import path from 'path';
import slug from 'slug';
import uuid from 'uuid';
import _ from 'lodash';

import * as settings from './settings';
import * as session from './session';
import * as notes from './notes';

import * as Model from '../model';
import FileWalker from '../../storage/file-walker';
import File from '../../storage/file';

export function select(tree, book, callback = null) {
    let baseDir = tree.get('settings', 'basePath');
    const bookDir = new File(path.join(baseDir, book.name));

    if (!bookDir.exists()) {
        const err = new Error(`That book (${book.name}) doesn't exist`);
        session.error(tree, err);
        callback && callback(err);
        return;
    }

    const books = tree.select('books');
    books.get().forEach((b, i) => {
        var bookCursor = books.select(i);
        books.set([i, 'active'], b.id === book.id);
    });

    notes.load(tree, (err) => {
        if (!err) {
            settings.setLastBook(tree, book.name);
        }
        callback && callback(err);
    });
};

export function uniqueDir(tree, name) {
    const basePath = tree.get('settings', 'basePath');

    let bookDir = new File(path.join(basePath, name));
    let attempt = 1;

    while (bookDir.exists()) {
        bookDir = new File(path.join(basePath, `${name}-${attempt}`));
        attempt++;
    }

    return bookDir;
}

export function remove(tree, book) {
    const basePath = tree.get('settings', 'basePath');
    const bookFile = new File(path.join(basePath, book.name));

    bookFile.on('error', (err) => {
        tree.set(['session', 'error'], err);
        console.error("Error renaming file", err);
    });

    bookFile.on('removed', () => {
        const bookIndex = tree.get('books').findIndex(b => b.id === book.id);
        if (bookIndex >= 0) {
            tree.select('books').splice([bookIndex, 1]);
        }
    });
    bookFile.remove();
}

export function rename(tree, book, name) {
    const basePath = tree.get('settings', 'basePath');
    const cursor = tree.select('books', {id: book.id});

    const dirNow = new File(path.join(basePath, book.name));
    const dirNext = uniqueDir(tree, name);

    dirNow.on('renamed', () => {
        cursor.set('name', dirNext.path.name);
        cursor.set('file', dirNow);
    });
    dirNow.on('error', (err) => {
        tree.set(['session', 'error'], err);
        console.error("Error renaming file", err);
    });
    dirNow.rename(dirNext.path.full);
}

export function create(tree, name) {
    // Create the file directory first
    const bookDir = uniqueDir(tree, name);
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
        notes.clear(tree);
        notes.create(tree);
    });
};


export function clear(tree) {
    tree.set('books', []);
}


/**
 * Scans the basePath for directories
**/
export function load(tree, callback = null) {
    const basePath = tree.get('settings', 'basePath');
    const books = tree.select('books');

    const walker = new FileWalker(basePath);
    walker.id = "loadBooks: " + walker.id;

    walker.depth = 0;
    walker.on('dir', (dir) => {
        if (books.get({name: dir.path.name})) {
            // Skip existing book
            return;
        }
        const found = Model.Book();
        found.file = dir;
        found.name = dir.path.name;
        books.push(found);
    });

    walker.on('error', (err) => {
        session.error(tree, err);
        callback && callback(err);
    });

    if (callback) walker.on('done', callback);
    walker.run();
}
