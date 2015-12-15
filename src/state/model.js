import moment from 'moment';
import uuid from 'uuid';

/**
 * Stores all of the app-wide preferences for someone.
**/
export function Settings() {
    return {
        theme: "Light",
        fontSize: 100,
        basePath: null,
        lastBook: null,
        throttle: null,
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
    title = title || moment().format('YYYY-MM-DD');
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
