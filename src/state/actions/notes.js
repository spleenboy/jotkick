import {activeIndex as activeBookIndex} from './books';

export function active(tree) {
    return tree.get('books', activeBookIndex(tree), 'notes', activeIndex(tree));
};

export function activeIndex(tree, bookIndex = null) {
    if (bookIndex === null) {
        bookIndex = activeBookIndex(tree);
    }
    const index = tree.get('books', bookIndex, 'notes').findIndex(n => n.active);
    return Math.max(0, index);
};

export function select(tree, index = 0) {
    const bookIndex = activeBookIndex(tree);
    const notes = tree.select('books', bookIndex, 'notes');
    notes.forEach((n, i) => {
        notes.set([i, 'active'], i === index);
    });
};

export function update(tree, key, value) {
    const bookIndex = activeBookIndex(tree);
    const noteIndex = activeIndex(tree, bookIndex);
    tree.set(['books', bookIndex, 'notes', noteIndex, key], value);
};
