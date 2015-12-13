import path from 'path';
import moment from 'moment';
import slug from 'slug';
import matter from 'gray-matter';

import * as Model from '../model';
import File from '../../storage/file';

export const EXTENSION = '.md';
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DEFAULT_THROTTLE = 1000;

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


export function calculatePath(tree, book, note) {
    const baseDir = tree.get('settings', 'basePath');
    const day = moment(note.data.created || new Date());
    return path.join(
                baseDir,
                book.name,
                day.format('YYYY'),
                day.format('MM'),
                slug(note.data.title) + EXTENSION
            );

}


export function renameFile(tree, book, note, callback = null) {
    if (!note.file) {
        console.error("Note does not have existing path");
        return false;
    }

    const file = new File(note.file.path.full);
    const newpath = calculatePath(tree, book, note);

    if (newpath === file.path.full) {
        return false;
    }

    file.rename(newpath);
    file.on('renamed', () => {
        const cursor = tree.select('books', {id: book.id}, 'notes', {id: note.id});
        cursor.set('file', file);
        callback && callback(null, file);
    });
};


export function save(tree, bookId, noteId, callback = null) {
    const book = tree.select('books', {id: bookId});
    const note = book.get('notes', {id: noteId});
    const body = matter.stringify(note.content, note.data);

    let fullpath;
    if (note.file) {
        fullpath = note.file.path.full;
    } else {
        fullpath = calculatePath(tree, book.get(), note);
        console.debug("No existing file for saving note. Calculating path", fullpath);
    }

    const file = new File(fullpath);
    file.write(body);

    file.on('written', () => {
        callback && callback(null, file);
    });

    file.on('error', (err) => {
        console.error("Error writing note to file", note, err);
        callback && callback(err, file);
    });
};
