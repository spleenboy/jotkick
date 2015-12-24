import moment from 'moment';
import uuid from 'uuid';
import _ from 'lodash';

/**
 * Stores all of the persistent app-wide preferences for someone.
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
 *¬ Stores all session-based data that doesn't need to persist
**/
export function Session() {
    return {
        query: null,
        messages: [],
    };
}


/**
 * Encapsulates a message that displays onscreen
**/
export function Message(text = '') {
    return {
        id: uuid(),
        err: null,
        text: text,
        type: 'alert',
        action: 'Dismiss',
        callback: null,
    };
};
Message.Alert = 'alert';
Message.Error = 'error';
Message.Action = 'action';

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
        pinned: false,
        loaded: false,
        data: {
            title: title,
            active: false,
            created: new Date(),
        },
        content: '',
    };
};


// Performs a comparison of notes, only carrying about the things
// that matter. Used to optimize component updates based on changes.
export function equalNotes(a, b) {
    const keys = ['id', 'file.path.full', 'pinned', 'loaded', 'data.title', 'data.active', 'content'];

    return !keys.some((key) => {
        const path = key.split('.');
        const av = _.get(a, path);
        const bv = _.get(b, path);

        if (av !== bv) {
            return true;
        }
        return false;
    });
};

/**
 * An entire state tree. Includes all data needed for this app.
**/
export function Tree() {
    return {
        settings: Settings(),
        session: Session(),
        books: [],
    };
};
