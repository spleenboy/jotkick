import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';

import fuzzy from 'fuzzy';

import NotesHeader from './notes-header';
import NoteList from './note-list';
import NoteCreateButton from './note-create-button';
import * as noteActions from '../state/actions/notes';

class NotesPage extends Component {
    filteredNotes(book) {
        if (!this.props.query) {
            return book.notes;
        }

        let notes = book.notes.concat();
        const options = {
            pre: '**',
            post: '**',
            extract: (note) => {
                return note.content;
            }
        };
        const matches = fuzzy.filter(this.props.query, notes, options);
        notes = matches.map((m) => {
            let note = m.original;
            note.search = {
                query: this.props.query,
                score: m.score,
                content: m.string,
            };
            note.data.active = false;
            return note;
        });
        return notes;
    }


    // Binds the active book as a first argument to the
    // specified method and returns it
    bindBook(method, ...args) {
        return () => {
            const book = this.props.books.find(b => b.active);
            method.apply(this, [book, ...args]);
        };
    }


    render() {
        const book = this.props.books.find(b => b.active) || this.props.books[0];

        if (!book) {
            return null;
        }

        const notes = this.filteredNotes(book);
        const bookCopy = {
            id: book.id,
            name: book.name,
        }

        let notesList;

        if (notes.length) {
            notesList = <NoteList book={bookCopy} notes={notes}/>
        } else {
            notesList = <NoteCreateButton book={bookCopy} onCreate={this.props.actions.createNote}/>
        }

        return <div className="notes-page" style={{minHeight: window.innerHeight}}>
                   <NotesHeader
                       ref="notesHeader"
                       books={this.props.books}
                       noteCount={notes.length}
                   />
                   {notesList}
               </div>
    }
}

export default branch(NotesPage, {
    cursors: {
        books: ['books'],
        query: ['session', 'query'],
    },
    actions: {
        createNote: noteActions.create,
    }
});
