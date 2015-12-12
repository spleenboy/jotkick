import path from 'path';
import moment from 'moment';
import slug from 'slug';
import matter from 'gray-matter';
import debounce from 'debounce';

import * as Model from '../model';
import File from '../../storage/file';

export const EXTENSION = '.md';
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DEFAULT_DEBOUNCE = 1000;

export function find(tree, book, note) {
    return tree.select('books', {id: book.id}, 'notes', {id: note.id});
}

export function active(tree) {
    const active = {active: true};
    return tree.get('books', active, 'notes', active);
};

export function deselect(tree, book) {
    const notes = tree.select('books', {id: book.id}, 'notes');
    notes.get().forEach((n, i) => {
        notes.set([i, 'data', 'active'], false);
    });
}

export function select(tree, book, note) {
    const notes = tree.select('books', {id: book.id}, 'notes');
    notes.get().forEach((n, i) => {
        const active = notes.select(i, 'data', 'active');
        active.set(n.id === note.id);
    });
};

export function pin(tree, book, note) {
    const cursor = find(tree, book, note).select('data');
    cursor.set('pinned', true);
    select(tree, book, note);
};

export function unpin(tree, book, note) {
    const cursor = find(tree, book, note).select('data');
    cursor.set('pinned', false);
    deselect(tree, book);
}

export function setTitle(tree, book, note, title) {
    const cursor = find(tree, book, note).select('data');
    cursor.set('title', title);
};

export function setContent(tree, book, note, content) {
    const cursor = find(tree, book, note);
    cursor.set('content', content);
}

export function remove(tree, book, note) {
    const notes = tree.select('books', {id: book.id}, 'notes');
    const noteIndex  = notes.get().findIndex((n) => n.id === note.id);
    if (noteIndex >= 0) {
        notes.splice(noteIndex, 1);
    }
    if (!note.file) {
        return;
    }
    const old = new File(note.file.path.full);
    old.delete();
}

export function create(tree, book) {
    const note = Model.Note();

    note.data.created = new Date();
    note.data.title   = moment().format(DATE_FORMAT);
    note.data.active  = true;

    const notes = tree.select('books', {id: book.id}, 'notes');
    notes.get().forEach((n, i) => {
        notes.set([i, 'active'], false);
    });

    notes.push(note);
    return note;
};


export function queueSave(tree, book, note, lastpath = null) {
    const delay = tree.get('settings', 'debounce') || DEFAULT_DEBOUNCE;
    const method = () => {
        save(tree, book.id, note.id, lastpath);
    }
    debounce(method, delay)();
};


export function save(tree, bookId, noteId, lastpath = null) {
    const book = tree.select('books', {id: bookId});
    const note = book.get('notes', {id: noteId});

    const body = matter.stringify(note.content, note.data);
    const basePath = tree.get('settings', 'basePath');

    let fullpath;
    if (note.file) {
        fullpath = note.file.path.full;
    } else {
        const created = moment(note.data.created);
        fullpath = path.join(
                       basePath,
                       book.get('name'),
                       created.format('YYYY'),
                       created.format('MM'),
                       slug(note.data.title) + EXTENSION 
                   );
    }

    const file = new File(fullpath);
    file.write(body);
    file.on('written', () => {
        if (lastpath && lastpath !== fullpath) {
            const old = new File(lastpath);
            old.delete();
        }
        console.debug("Updated", fullpath);
    });
    file.on('error', (err) => {
        console.error("Error writing note to file", note, err);
    });
};
