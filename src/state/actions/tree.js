import * as Model from '../model';
import {create as createBook} from './books';
import {create as createNote} from './notes';

export function init(tree) {
    tree.set(Model.Tree());
    const book = createBook(tree);
    const note = createNote(tree, book);
}
