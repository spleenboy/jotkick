import * as Model from '../model';
import {loadBooks, select as selectBook} from './books';

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
}


function saveSettings(e) {
    if (e.data.currentData === undefined) {
        return;
    }
    storage.setItem('settings', e.data.currentData);
}
