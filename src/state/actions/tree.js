import * as Model from '../model';
import {create as createBook, loadBooks, select as selectBook} from './books';
import {create as createNote, queueSave as queueSaveNote} from './notes';

import LocalStorage from '../../storage/local';

const storage = new LocalStorage();

export function load(tree, callback = null) {
    const whenReady = () => {
        tree.commit();
        callback && callback();
        setTimeout(addEventHandlers.bind(this, tree), 500);
    }

    storage.getItem('settings').then((data) => {
        if (data) tree.set('settings', data);
        tree.commit();

        loadBooks(tree, () => {
            const found = tree.get('books', {name: data.lastBook});
            if (found) {
                selectBook(tree, found, whenReady);
            } else {
                whenReady();
            }
        });
    });
}


function addEventHandlers(tree) {
    tree.select('settings').on('update', saveSettings);
    tree.select('books', (b) => b.active, 'notes').on('update', saveNotes);
}


function saveSettings(e) {
    if (e.data.currentData === undefined) {
        return;
    }
    storage.setItem('settings', e.data.currentData);
}


function saveNotes(e) {
    const last    = e.data.previousData;
    const current = e.data.currentData;
    const tree    = e.target.tree;

    if (!current || !tree) return;

    function noteChanged(now, then) {
        if (!then) return false;
        if (now.content !== then.content) return true;
        return ['active', 'pinned'].some((key) => {
            if (now.data[key] !== then.data[key]) {
                return true;
            }
        });
    }

    let book;
    current.forEach((note) => {
        const lastNote = last.find((n) => n.id === note.id);
        if (!noteChanged(note, lastNote)) {
            return;
        }
        book = book || tree.get('books', {active: true});
        queueSaveNote(tree, book, note);
    });
}
