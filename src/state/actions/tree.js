import * as Model from '../model';
import {create as createBook} from './books';
import {create as createNote} from './notes';

import LocalStorage from '../../storage/local';

const storage = new LocalStorage();

export function init(tree) {
    Promise.all([
        updateFromStorage.bind(this, tree, 'settings'),
        updateFromStorage.bind(this, tree, 'books')
    ]).then((collected) => {
        tree.commit();
        addEventHandlers(tree);
    });
}


export function updateFromStorage(tree, key) {
    return storage.getItem(key, (data) => {
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
