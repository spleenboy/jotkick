import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';

import NotesHeader from './notes-header';
import NoteList from './note-list';
import actions from '../state/actions/';

class NotesPage extends Component {
    render() {
        const book = this.props.books.find(b => b.active) || this.props.books[0];

        if (!book) {
            return null;
        }

        let notes = book.notes.concat();
        notes.sort((a, b) => {
            if (a.data.pinned && !b.data.pinned) {
                return -1;
            }
            if (b.data.pinned && !a.data.pinned) {
                return 1;
            }
            if (a.data.pinned && b.data.pinned) {
                return b.data.pinOrder - a.data.pinOrder;
            }
            if (a.data.created < b.data.created) {
                return -1;
            }
            if (a.data.created > b.data.created) {
                return 1;
            }
            return 0;
        });

        return <div className="notes-page">
                   <NotesHeader
                       books={this.props.books}
                       onBookCreate={this.props.actions.createBook.bind(this)}
                       onBookChange={this.props.actions.selectBook.bind(this)}
                       onNoteCreate={this.props.actions.createNote.bind(this)}
                   />
                   <NoteList
                       book={book}
                       notes={notes}
                       actions={this.props.actions}
                   />
               </div>
    }
}

export default branch(NotesPage, {
    cursors: {
        books: ['books'],
    },
    actions: {
        createBook: actions.books.create,
        selectBook: actions.books.select,
        setBookTitle: actions.books.setTitle,
        createNote: actions.notes.create,
        selectNote: actions.notes.select,
        pinNote: actions.notes.pin,
        unpinNote: actions.notes.unpin,
        setNoteTitle: actions.notes.setTitle,
        setNoteContent: actions.notes.setContent,
    }
});
