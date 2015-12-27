import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';

import fuzzy from 'fuzzy';

import NotesHeader from './notes-header';
import NoteList from './note-list';
import NoteCreateButton from './note-create-button';
import * as noteActions from '../state/actions/notes';

class NotesPage extends Component {
    filteredNotes() {
        if (!this.props.query) {
            return this.props.notes;
        }

        let notes = this.props.notes.concat();
        const options = {
            pre: '',
            post: '',
            extract: (note) => {
                return note.content;
            }
        };
        const matches = fuzzy.filter(this.props.query, notes, options);
        notes = matches.map((m) => {
            let note = m.original;
            note.search = {
                score: m.score,
                content: m.string,
            };
            note.data.active = false;
            return note;
        });
        return notes;
    }


    render() {
        const book = this.props.books.find(b => b.active);

        if (!book) {
            return null;
        }

        const notes = this.filteredNotes(this.props.notes);

        let notesList;

        if (notes.length) {
            notesList = <NoteList notes={notes}/>
        } else {
            notesList = <NoteCreateButton book={book} onCreate={this.props.actions.createNote}/>
        }

        return <div className="notes-page" style={{minHeight: window.innerHeight}}>
                   <NotesHeader ref="notesHeader" books={this.props.books} />
                   {notesList}
               </div>
    }
}

export default branch(NotesPage, {
    cursors: {
        books: ['books'],
        notes: ['notes'],
        query: ['session', 'query'],
    },
    actions: {
        createNote: noteActions.create,
    }
});
