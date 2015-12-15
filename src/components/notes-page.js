import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';

import fuzzy from 'fuzzy';
import Snackbar from 'material-ui/lib/snackbar';

import NotesHeader from './notes-header';
import NoteList from './note-list';
import actions from '../state/actions/';

class NotesPage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            undoDelete: null,
            message: null,
            query: null,
        };
    }


    handleRemoveNote(book, note) {
        this.props.actions.deleteNote(book, note);
        const undoDelete = () => {
            this.props.actions.createNote(book, note);
            this.setState({undoDelete: null});
            this.refs.deletedNote.dismiss();
        };
        this.setState({undoDelete});
        this.refs.deletedNote.show();
    }


    handleUndoDelete() {
        this.state.undoDelete();
        this.setState({undoDelete: null});
    }


    handleUndoDeleteDismiss() {
        this.setState({undoDelete: null});
    }


    handleSearchNotes(value) {
        this.setState({query: value});
    }


    handleTitleChange(book, note, value) {
        if (!value) {
            return;
        }

        this.props.actions.setNoteTitle(book, note, value);
    }


    handleNoteSelect(book, note) {
        this.setState({query: ''});
        this.props.actions.selectNote(book, note);
    }


    filteredNotes(book) {
        let notes = book.notes.concat();

        if (!this.state.query) {
            notes.forEach((n) => n.search = {});
            return this.sortNotes(notes);
        }

        const options = {
            pre: '**',
            post: '**',
            extract: (note) => {
                return note.content;
            }
        };
        const matches = fuzzy.filter(this.state.query, notes, options);
        notes = matches.map((m) => {
            let note = m.original;
            note.search = {
                query: this.state.query,
                score: m.score,
                content: m.string,
            };
            note.data.active = false;
            return note;
        });
        return notes;
    }


    sortNotes(notes) {
        return notes.sort((a, b) => {
            if (a.data.pinned && !b.data.pinned) {
                return -1;
            }
            if (b.data.pinned && !a.data.pinned) {
                return 1;
            }
            if (a.data.pinned && b.data.pinned) {
                return b.data.pinOrder - a.data.pinOrder;
            }
            if (a.data.created > b.data.created) {
                return -1;
            }
            if (a.data.created < b.data.created) {
                return 1;
            }
            return 0;
        });
    }


    render() {
        const book = this.props.books.find(b => b.active) || this.props.books[0];

        if (!book) {
            return null;
        }

        const notes = this.filteredNotes(book);

        return <div className="notes-page">
                   <NotesHeader
                       books={this.props.books}
                       onBookCreate={this.props.actions.createBook.bind(this)}
                       onBookChange={this.props.actions.selectBook.bind(this)}
                       onNoteCreate={this.props.actions.createNote.bind(this)}
                       onPageChange={this.props.onPageChange.bind(this)}
                       onSearch={this.handleSearchNotes.bind(this)}
                   />
                   <NoteList
                       notes={notes}
                       onSelect={this.handleNoteSelect.bind(this, book)}
                       onTitleChange={this.handleTitleChange.bind(this, book)}
                       onTitleBlur={this.props.actions.renameNoteFile.bind(this, book)}
                       onPin={this.props.actions.pinNote.bind(this, book)}
                       onUnpin={this.props.actions.unpinNote.bind(this, book)}
                       onContentChange={this.props.actions.setNoteContent.bind(this, book)}
                       onRemove={this.handleRemoveNote.bind(this, book)}
                   />
                   <Snackbar
                       ref="deletedNote"
                       message="Your note was deleted!"
                       onDismiss={this.handleUndoDeleteDismiss.bind(this)}
                       onActionTouchTap={this.handleUndoDelete.bind(this)}
                       action="Undo"
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
        renameNoteFile: actions.notes.renameFile,
        pinNote: actions.notes.pin,
        unpinNote: actions.notes.unpin,
        setNoteTitle: actions.notes.setTitle,
        setNoteContent: actions.notes.setContent,
        calculateNotePath: actions.notes.calculatePath,
        deleteNote: actions.notes.remove,
    }
});
