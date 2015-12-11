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
        file: null,
        data: {
            id: uuid(),
            title: title,
            active: false,
            pinned: false,
            pinOrder: 0,
            created: new Date(),
            modified: null,
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
