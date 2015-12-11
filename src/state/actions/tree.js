import * as Model from '../model';
import {create as createBook, loadBooks} from './books';
import {create as createNote} from './notes';

import LocalStorage from '../../storage/local';

const storage = new LocalStorage();

export function init(tree) {
    updateFromStorage(tree, 'settings')
    .then((data) => {
        loadBooks(tree);
        tree.commit();
        addEventHandlers(tree);
    });
}


export function updateFromStorage(tree, key) {
    return storage.getItem(key).then((data) => {
        if (data) tree.set(key, data);
    });
}

function addEventHandlers(tree) {
    tree.select('settings').on('update', saveSettings);
}


function saveSettings(e) {
    if (e.data.currentData === undefined) {
        return;
    }
    storage.setItem('settings', e.data.currentData);
}
