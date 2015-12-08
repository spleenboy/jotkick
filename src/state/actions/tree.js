import * as Model from '../model';

export function populate(tree) {
    let root = Model.Tree();
    let activeBookIndex = root.books.findIndex(b => b.active);
    if (activeBookIndex < 0) {
        activeBookIndex = 0;
        root.books[0].active = true;
    }
    let book = root.books[activeBookIndex];
    let activeNoteIndex = book.notes.findIndex(n => n.active);
    if (activeNoteIndex < 0) {
        book.notes[0].active = true;
    }
    tree.set(root);
    return root;
}
