import slug from 'slug';
import moment from 'moment';
import uuid from 'uuid';

/**
 * Stores all of the app-wide preferences for someone.
**/
export function Settings() {
    return {
        theme: "index",
        fontSize: 100,
        basePath: null,
        lastBook: null,
        debounce: 1000,
        dateDisplayFormat: "YYYY-MM-DD",
    };
};

/**
 * This is a top-level container for a collection of notes.¬
 * The name is used for directory management and as an id.
**/
export function Book(name = null) {
    return {
        id: uuid(),
        name: 'home',
        active: false,
        notes: [],
    };
};

/**
 * Belongs to a Book, used to store content in individual files.
 * The "title" is used for display.
**/
export function Note(title = null) {
    const now = moment();
    title = title || now.format('YYYY-MM-DD');
    name  = slug(title);
    return {
        id: uuid(),
        file: null,
        data: {
            title: title,
            active: false,
            pinned: false,
            created: new Date(),
        },
        content: '',
    };
};

/**
 * An entire state tree. Includes all data needed for this app.
**/
export function Tree() {
    return {
        settings: Settings(),
        books: [],
    };
};
