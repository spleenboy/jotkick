import * as Model from '../model';
import moment from 'moment';
import slug from 'slug';

export const DATE_FORMAT = 'YYYY-MM-DD';

export function find(tree, book, note) {
    return tree.select('books', {id: book.id}, 'notes', {id: note.id});
}

export function active(tree) {
    const active = {active: true};
    return tree.get('books', active, 'notes', active);
};

export function select(tree, book, note) {
    const notes = tree.select('books', {id: book.id}, 'notes');
    notes.get().forEach((n, i) => {
        notes.set([i, 'active'], n.id === note.id);
    });
};

export function pin(tree, book, note, order = 0) {
    const cursor = find(tree, book, note);
    cursor.set('pinned', true);
    cursor.set('pinOrder', order);
};

export function unpin(tree, book, note) {
    const cursor = find(tree, book, note);
    cursor.set('pinned', false);
    cursor.set('pinOrder', 0);
}

export function setTitle(tree, book, note, title) {
    const cursor = find(tree, book, note);
    cursor.set('title', title);
    cursor.set('name', slug(title));
    cursor.set('modified', new Date());
};

export function setContent(tree, book, note, content) {
    const cursor = find(tree, book, note);
    cursor.set('content', content);
    cursor.set('modified', new Date());
}

export function create(tree, book) {
    const note = Model.Note();

    note.created = new Date();
    note.title   = moment().format(DATE_FORMAT);
    note.name    = slug(note.title);
    note.active  = true;

    const notes = tree.select('books', {id: book.id}, 'notes');
    notes.get().forEach((n, i) => {
        notes.set([i, 'active'], false);
    });

    notes.push(note);
    return note;
};
