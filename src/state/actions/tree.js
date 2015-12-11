import * as Model from '../model';
import {create as createBook, loadBooks, select as selectBook} from './books';
import {create as createNote} from './notes';

import LocalStorage from '../../storage/local';

const storage = new LocalStorage();

export function init(tree) {
    const whenReady = () => {
        tree.commit();
        addEventHandlers(tree);
    }

    updateFromStorage(tree, 'settings')
    .then((data) => {
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


export function updateFromStorage(tree, key) {
    return storage.getItem(key).then((data) => {
        if (data) tree.set(key, data);
        return data;
    });
}

function addEventHandlers(tree) {
    tree.select('settings').on('update', saveSettings);
    tree.select('notes').on('update', (e) => {
        console.debug(e.data);
    });
}


function saveSettings(e) {
    if (e.data.currentData === undefined) {
        return;
    }
    storage.setItem('settings', e.data.currentData);
}
