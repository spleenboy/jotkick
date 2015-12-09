import slug from 'slug';
import * as Model from '../model';

function active(tree) {
    return tree.get('books', {active: true});
};

export function select(tree, book) {
    const books = tree.select('books');
    books.forEach((b, i) => {
        books.set([i, 'active'], b.name === book.name);
    });
};

export function setTitle(tree, book, title) {
    const cursor = tree.select('books', {id: book.id});
    cursor.set('title', title);
    cursor.set('name', slug(title));
};

export function create(tree) {
    const book = Model.Book();
    const books = tree.select('books');
    books.get().forEach((b, i) => {
        books.set([i, 'active'], false);
    });
    book.active = true;
    books.push(book);
    return book;
};
