import path from 'path';
import moment from 'moment';
import slug from 'slug';
import matter from 'gray-matter';

import * as Model from '../model';
import * as books from './books';
import File from '../../storage/file';

export const EXTENSION = '.md';
export const DATE_FORMAT = 'YYYY-MM-DD';
export const PINNED_DIR = 'pinned';
export const DEFAULT_THROTTLE = 2000;

export function find(tree, book, note) {
    return tree.select('books', {id: book.id}, 'notes', {id: note.id});
}

export function active(tree) {
    const active = {active: true};
    return tree.get('books', active, 'notes', active);
};

export function deselect(tree, book) {
    const notes = tree.select('books', {id: book.id}, 'notes');
    const save = [];
    notes.get().forEach((n, i) => {
        if (n.data.active) save.push(n);
        notes.set([i, 'data', 'active'], false);
    });
    save.forEach((n) => {queueSave(tree, book, n)});
}

export function select(tree, book, note) {
    const notes = tree.select('books', {id: book.id}, 'notes');
    const save = [];
    notes.get().forEach((n, i) => {
        const active = notes.select(i, 'data', 'active');
        const wasSelected = active.get();
        const selected = n.id === note.id;
        active.set(selected);

        if (wasSelected !== selected) {
            save.push(n);
        }
    });
    save.forEach((n) => {queueSave(tree, book, n)});
};

export function pin(tree, book, note) {
    const cursor = find(tree, book, note);
    cursor.set('pinned', true);
    select(tree, book, note);
    renameFile(tree, book, cursor.get());
    books.sortNotes(tree, book);
};

export function unpin(tree, book, note) {
    const cursor = find(tree, book, note);
    cursor.set('pinned', false);
    deselect(tree, book);
    renameFile(tree, book, cursor.get());
    books.sortNotes(tree, book);
}

export function setTitle(tree, book, note, title) {
    const cursor = find(tree, book, note).select('data');
    cursor.set('title', title);
};

export function saveTitle(tree, book, note, title) {
    setTitle(tree, book, note, title);
    save(tree, book.id, note.id, (err) => {
        renameFile(tree, book, note);
    });
};

export function setContent(tree, book, note, content) {
    const cursor = find(tree, book, note);
    cursor.set('content', content);
    queueSave(tree, book, note);
}

export function remove(tree, book, note) {
    const notes = tree.select('books', {id: book.id}, 'notes');
    const noteIndex  = notes.get().findIndex((n) => n.id === note.id);

    if (noteIndex >= 0) {
        notes.splice([noteIndex, 1]);
    }

    if (!note.file) {
        return;
    }

    const old = new File(note.file.path.full);
    old.delete();
}

export function create(tree, book, note = null) {
    if (!note) {
        note = Model.Note();

        note.data.created = new Date();
        note.data.title   = moment().format(DATE_FORMAT);
        note.data.active  = true;
    }

    const notes = tree.select('books', {id: book.id}, 'notes');
    notes.get().forEach((n, i) => {
        notes.set([i, 'active'], false);
    });

    notes.push(note);
    return note;
};


export function calculatePath(tree, book, note) {
    const baseDir = tree.get('settings', 'basePath');
    const day = moment(note.data.created || new Date());
    if (!note.pinned) {
        return path.join(
                    baseDir,
                    book.name,
                    day.format('YYYY'),
                    day.format('MM'),
                    slug(note.data.title) + EXTENSION
               );
    } else {
        return path.join(
                    baseDir,
                    book.name,
                    PINNED_DIR,
                    slug(note.data.title) + EXTENSION
               );
    }
}


export function renameFile(tree, book, note, callback = null) {
    // Not saved yet.
    if (!note.file) {
        console.debug("Note does not have existing path");
        return false;
    }

    const file = new File(note.file.path.full);
    let newpath = calculatePath(tree, book, note);

    // No change, no rename
    if (newpath === file.path.full) {
        return false;
    }

    const newfile = File.findUniqueFile(newpath);
    const cursor = tree.select('books', {id: book.id}, 'notes', {id: note.id});

    file.on('renamed', () => {
        cursor.set('file', file);
        callback && callback(null, file);
    });

    file.on('error', (err) => {
        session.error(tree, err);
        callback && callback(err, file);
    });

    save(tree, book.id, note.id, () => {
        file.rename(newfile.path.full);
    });
};


export function queueSave(tree, book, note) {
    const throttle = tree.get('settings', 'throttle') || DEFAULT_THROTTLE;

    // Check for an existing request. If one is found, push out the next
    // save by the throttle value
    const cursor = find(tree, book, note);

    const method = () => {
        save(tree, book.id, note.id, (err, file) => {
            cursor.unset('saving');
        });
    }

    const saving = cursor.get('saving');

    // Clear out the last one
    saving && clearTimeout(saving);

    // Queue up the next save
    cursor.set('saving', setTimeout(method, throttle));
};


export function save(tree, bookId, noteId, callback = null) {
    const book = tree.select('books', {id: bookId});
    const note = book.get('notes', {id: noteId});
    const body = matter.stringify(note.content, note.data).trim();

    let file;
    if (note.file) {
        // If the note already has a file, assume it's a unique name
        file = new File(note.file.path.full);
    } else {
        // Otherwise, try to figure out a unique name
        const fullpath = calculatePath(tree, book.get(), note);
        file = File.findUniqueFile(fullpath);
        console.debug("No existing file for saving note. Calculating path", fullpath);
    }

    file.write(body);

    file.on('written', () => {
        book.set(['notes', {id: noteId}, 'file'], file);
        callback && callback(null, file);
    });

    file.on('error', (err) => {
        console.error("Error writing note to file", note, err);
        callback && callback(err, file);
    });
};


// Loads the content for a note
export function load(tree, book, note) {
    const cursor = tree.select('books', {id: book.id}, 'notes', {id: note.id});
    if (!note.file) {
        cursor.set('loaded', true);
        return;
    }
    note.file.read((err) => {
        if (err) {
            session.error(tree, err);
            return;
        }
        const parsed = matter(note.file.content);
        cursor.set('content', parsed.content);
        cursor.set('data', parsed.data);
        cursor.set('loaded', true);
    });
};
