import moment from 'moment';

/**
 * Stores all of the app-wide preferences for someone.
**/
export function Settings() {
    return {
        theme: "index",
        basePath: null,
        dateDisplayFormat: "YYYY-MM-DD",
    };
};

/**
 * This is a top-level container for a collection of notes.¬
 * The name is used for directory management and as an id.
**/
export function Book(name = "Home") {
    return {
        name: name ,
        title: name,
        active: false,
        notes: [Note()],
    };
};

/**
 * Belongs to a Book, used to store content in individual files.
 * The "name" is used for file management and as an id. 
 * The "title" is used for display.
**/
export function Note(name = null) {
    return {
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
export default function State() {
    return {
        settings: Settings(),
        books: [Book()]
    };
};
