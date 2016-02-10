import path from 'path';
import moment from 'moment';
import slug from 'slug';
import matter from 'gray-matter';

import * as Model from '../model';
import * as session from './session';
import * as books from './books';
import FileWalker from '../../storage/file-walker';
import File from '../../storage/file';

export const EXTENSION = '.md';
export const DATE_FORMAT = 'YYYY-MM-DD';
export const PINNED_DIR = 'pinned';
export const DEFAULT_THROTTLE = 2000;

export function active(tree) {
    const active = {active: true};
    return tree.get('notes', active);
};

export function deselect(tree) {
    const notes = tree.select('notes');
    const toSave = [];
    notes.get().forEach((n, i) => {
        if (n.data.active) {
            toSave.push(n);
            notes.set([i, 'data', 'active'], false);
        }
    });
    toSave.forEach((n) => {queueSave(tree, n)});
}

export function select(tree, note) {
    const notes = tree.select('notes');
    session.query(tree, '');
    const toSave = [];
    notes.get().forEach((n, i) => {
        const active = notes.select(i, 'data', 'active');
        const wasSelected = active.get();
        const selected = n.id === note.id;

        if (wasSelected !== selected) {
            active.set(selected);
            toSave.push(n);
        }
    });
    toSave.forEach((n) => {queueSave(tree, n)});
};

export function pin(tree, note) {
    const cursor = tree.select('notes', {id: note.id});
    cursor.set('pinned', true);
    select(tree, note);
    renameFile(tree, cursor.get());
    sort(tree);
};

export function unpin(tree, note) {
    const cursor = tree.select('notes', {id: note.id});
    cursor.set('pinned', false);
    deselect(tree);
    renameFile(tree, cursor.get());
    sort(tree);
}

export function setTitle(tree, note, title) {
    const cursor = tree.select('notes', {id: note.id}, 'data');
    cursor.set('title', title);
};

export function saveTitle(tree, note, title) {
    setTitle(tree, note, title);
    renameFile(tree, note, (err) => {
        if (!err) save(tree, note);
    });
};

export function setContent(tree, note, content) {
    const cursor = tree.select('notes', {id: note.id});
    cursor.set('content', content);
    queueSave(tree, note);
}

export function remove(tree, note) {
    const notes = tree.select('notes');
    const noteIndex  = notes.get().findIndex((n) => n.id === note.id);

    if (noteIndex >= 0) {
        notes.splice([noteIndex, 1]);
    }

    if (!note.file) {
        return;
    }

    const old = new File(note.file.path.full);
    old.delete();
}

export function clear(tree) {
    tree.set('notes', []);
}

export function copy(tree, note) {
    const clone = Model.Note(`${note.data.title} Copy`);

    clone.data.created = new Date();
    clone.content = note.content;
    clone.pinned  = note.pinned;

    return create(tree, clone);
}

export function create(tree, note = null) {
    const book = tree.get('books', {active: true});

    if (!book) {
        session.error(tree, new Error("No book selected"));
        return false;
    }

    if (!note) {
        note = Model.Note();
        note.data.created = new Date();
        note.data.title   = moment().format(DATE_FORMAT);
    }

    note.bookName = book.name;
    note.data.active = true;
    const notes = tree.select('notes');

    notes.get().forEach((n, i) => {
        notes.set([i, 'data', 'active'], false);
    });

    notes.push(note);
    sort(tree);
    return note;
};


export function sort(tree) {
    const notes = tree.get('notes');
    if (!notes) {
        return;
    }

    let sorted = _.sortByOrder(notes, (n) => {
        return n.file && n.file.path.full;
    }, 'desc');

    tree.set('notes', sorted);
}


/**
 * Loads up the notes for the book
**/
export function load(tree, callback = null) {
    const book = tree.get('books').find(b => b.active);

    if (!book) {
        tree.set('notes', []);
        callback && callback();
        return;
    }

    let baseDir = tree.get('settings', 'basePath');

    baseDir = path.join(baseDir, book.name);

    const walker = new FileWalker(baseDir);
    walker.id = "loadNotes: " + walker.id;
    walker.throttle = 50;
    walker.filter = (filenames) => {
        // Include only markdown files and folders
        const filtered = _.filter(filenames, (filename) => {
            const ext = path.extname(filename);
            return ext === '.md' || ext === '';
        });

        filtered.sort().reverse();
        return filtered;
    };

    const collected = [];
    walker.on('file', (file) => {
        if (file.path.ext !== '.md') {
            return;
        }

        // Initialize each note with basic information
        const note = Model.Note();

        note.bookName = book.name;
        note.file = file;
        note.pinned = file.path.dir === path.join(baseDir, PINNED_DIR);
        note.data.title = file.path.name;

        loadContent(tree, note);

        tree.push('notes', note);
    });

    walker.on('error', (err) => {
        session.error(tree, err);
        settings.setLastBook(tree, null);
        callback && callback(err);
    });

    walker.on('done', () => {
        sort(tree);
        callback && callback();
    });

    tree.set('notes', []);
    tree.commit();
    walker.run();
};


export function calculatePath(tree, note) {
    const baseDir = tree.get('settings', 'basePath');
    const day = moment(note.data.created || new Date());
    if (!note.pinned) {
        return path.join(
                    baseDir,
                    note.bookName,
                    day.format('YYYY'),
                    day.format('MM'),
                    slug(note.data.title) + EXTENSION
               );
    } else {
        return path.join(
                    baseDir,
                    note.bookName,
                    PINNED_DIR,
                    slug(note.data.title) + EXTENSION
               );
    }
}


export function setBook(tree, note, book) {
    const cursor = tree.select('notes', {id: note.id});

    cursor.set('bookName', book.name);
    note.bookName = book.name;

    renameFile(tree, note, (err) => {
        if (!err) {
            books.select(tree, book);
        }
    });
}


export function renameFile(tree, note, callback = null) {
    // Not saved yet.
    if (!note.file) {
        console.debug("Note does not have existing path");
        return false;
    }

    const file = new File(note.file.path.full);
    let newpath = calculatePath(tree, note);

    // No change, no rename
    if (newpath === file.path.full) {
        return false;
    }

    const newfile = File.findUniqueFile(newpath);

    file.on('renamed', () => {
        const cursor = tree.select('notes', {id: note.id});
        cursor.set('file', file);
        callback && callback();
    });

    file.on('error', (err) => {
        session.error(tree, err);
        callback && callback(err, file);
    });

    file.rename(newfile.path.full);
};


export function queueSave(tree, note) {
    process.nextTick(() => {
        const throttle = tree.get('settings', 'throttle') || DEFAULT_THROTTLE;

        // Check for an existing request. If one is found, push out the next
        // save by the throttle value
        const cursor = tree.select('notes', {id: note.id});

        const method = () => {
            save(tree, note);
        }

        const saving = cursor.get('saving');

        // Clear out the last one
        saving && clearTimeout(saving);

        // Queue up the next save
        cursor.set('saving', setTimeout(method, throttle));
    });
};


export function save(tree, note, callback = null) {
    const cursor = tree.select('notes', {id: note.id});
    note = cursor.get(); // Refresh the values from the tree
    const body = matter.stringify(note.content, note.data).trim();

    let file;
    if (note.file) {
        // If the note already has a file, assume it's a unique name
        file = new File(note.file.path.full);
    } else {
        // Otherwise, try to figure out a unique name
        const fullpath = calculatePath(tree, note);
        file = File.findUniqueFile(fullpath);
        console.debug("No existing file for saving note. Calculating path", fullpath);
    }

    file.on('written', () => {
        if (cursor.exists()) {
            cursor.set('file', file);
            cursor.set('saving', false);
        }
        callback && callback(null, file);
    });

    file.on('error', (err) => {
        console.error("Error writing note to file", note, err);
        cursor.set('saving', false);
        callback && callback(err, file);
    });

    file.write(body);
};


// Loads the content for a note
export function loadContent(tree, note) {
    const cursor = tree.select('notes', {id: note.id});
    if (!note.file) {
        cursor.set('loaded', true);
        return;
    }
    note.file.read((err) => {
        if (err) {
            session.error(tree, err);
            return;
        }
        const parsed = matter(note.file.content);
        cursor.set('content', parsed.content);
        cursor.set('data', parsed.data);
        cursor.set('loaded', true);
    });
};
