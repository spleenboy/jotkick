import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';

import fuzzy from 'fuzzy';

import NotesHeader from './notes-header';
import NoteList from './note-list';
import NoteCreateButton from './note-create-button';
import * as noteActions from '../state/actions/notes';

class NotesPage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            dragging: false,
        };
    }


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


    handleDragStart(e) {
        e.preventDefault();
        this.setState({dragging: true});
    }


    handleDragStop(e) {
        this.setState({dragging: false});
    }


    handleDragDrop(e) {
        e.preventDefault();
        const files = e.dataTransfer && e.dataTransfer.files;
        console.debug("You dropped files!", files);
    }


    render() {
        const book = this.props.books.find(b => b.active);

        if (!book) {
            return null;
        }

        const notes = this.filteredNotes(this.props.notes);
        return <div className="notes-page" style={{minHeight: window.innerHeight}}
                   onDragEnter={this.handleDragStart.bind(this)}
                   onDragOver={this.handleDragStart.bind(this)}
                   onDragLeave={this.handleDragStop.bind(this)}
                   onDragEnd={this.handleDragStop.bind(this)}
                   onDragDrop={this.handleDragDrop.bind(this)}
                   onDrop={this.handleDragDrop.bind(this)}
               >
                   <NotesHeader ref="notesHeader" books={this.props.books} book={book} />
                   <NoteList notes={notes}/>
                   <NoteCreateButton book={book} onCreate={this.props.actions.createNote}/>
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
