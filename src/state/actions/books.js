export function active(tree) {
    return tree.get('books', activeIndex(tree));
};

export function activeIndex(tree) {
    const index = tree.get('books').findIndex(b => b.active);
    return Math.max(0, index);
};

export function select(tree, index = 0) {
    const books = tree.select('books');
    books.forEach((book, i) => {
        books.set([i, 'active'], i === index);
    });
};

export function update(tree, key, value) {
    const bookIndex = activeBookIndex(tree);
    tree.set(['books', bookIndex, key], value);
};

export function add(tree, book) {
    tree.push('books', book);
};
