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
        name: name ,
        title: name,
        active: false,
        notes: [],
    };
};

/**
 * Belongs to a Book, used to store content in individual files.
 * The "name" is used for file management and as an id. 
 * The "title" is used for display.
**/
export function Note(name = null) {
    return {
        id: uuid(),
        name: name,
        title: name,
        pinned: false,
        pinOrder: 0,
        active: false,
        created: new Date(),
        modified: null,
        content: "",
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
