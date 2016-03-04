import * as books from './books';
import LocalStorage from '../storage/local';

const storage = new LocalStorage();

export function update(tree, key, value) {
    tree.set(['settings', key], value);
    saveLocal(tree);
};


export function setLastBook(tree, bookName) {
    tree.set(['settings', 'lastBook'], bookName);
    saveLocal(tree);
}

export function setBasePath(tree, path) {
    const oldPath = tree.get('settings', 'basePath');

    if (oldPath === path) {
        return;
    }

    const cursor = tree.select('settings');
    cursor.set('basePath', path);
    cursor.unset('lastBook');

    books.clear(tree);
    books.load(tree);
}


export function setTheme(tree, theme) {
    tree.set(['settings', 'theme'], theme);
    saveLocal(tree);
}


export function load(tree, callback = null) {
    function whenReady() {
        tree.commit();
        callback && callback();
    }

    storage.getItem('settings').then((data) => {
        if (!data) {
            return whenReady();
        }

        tree.set('settings', data);

        if (!data.basePath) {
            return whenReady();
        }

        books.clear(tree);
        books.load(tree, () => {
            const found = tree.get('books', {name: data.lastBook});
            if (found) {
                books.select(tree, found, whenReady);
            } else {
                whenReady();
            }
        });
    });
}


function saveLocal(tree) {
    const data = tree.get('settings');
    storage.setItem('settings', data);
}
