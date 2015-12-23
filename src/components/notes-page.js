import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';
import Mousetrap from 'mousetrap';

import fuzzy from 'fuzzy';
import Snackbar from 'material-ui/lib/snackbar';

import NotesHeader from './notes-header';
import NoteList from './note-list';
import NoteCreateButton from './note-create-button';
import actions from '../state/actions/';

class NotesPage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            undoDelete: null,
            message: null,
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
        this.props.actions.setQuery(value);
    }


    handleTitleChange(book, note, value) {
        if (!value) {
            return;
        }

        this.props.actions.setNoteTitle(book, note, value);
    }


    handleRenameNoteFile(book, note, value) {
        this.props.actions.saveNoteTitle(book, note, value);
    }


    handleNoteSelect(book, note) {
        this.refs.notesHeader.cancelSearch();
        this.props.actions.selectNote(book, note);
    }


    handleNoteDeselect(book, note) {
        this.props.actions.deselectNotes(book);
    }


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


    // Binds the active book and note as the first
    // two arguments to a method. Returns the new method
    bindBookAndNote(method, ...args) {
        return () => {
            const book = this.props.books.find(b => b.active);
            const note = book && book.notes.find(n => n.active);
            method.apply(this, [book, note, ...args]);
        };
    }


    componentDidMount() {
        Mousetrap.bind('command+n', this.bindBook(this.props.actions.createNote));
    }


    render() {
        const book = this.props.books.find(b => b.active) || this.props.books[0];

        if (!book) {
            return null;
        }

        const notes = this.filteredNotes(book);

        let notesList;

        if (book.notes.length) {
            notesList = <NoteList
                            notes={notes}
                            onSelect={this.handleNoteSelect.bind(this, book)}
                            onDeselect={this.handleNoteDeselect.bind(this, book)}
                            onTitleChange={this.handleTitleChange.bind(this, book)}
                            onTitleBlur={this.handleRenameNoteFile.bind(this, book)}
                            onPin={this.props.actions.pinNote.bind(this, book)}
                            onUnpin={this.props.actions.unpinNote.bind(this, book)}
                            onContentChange={this.props.actions.setNoteContent.bind(this, book)}
                            onRemove={this.handleRemoveNote.bind(this, book)}
                        />
        } else {
            notesList = <NoteCreateButton
                            book={book}
                            onCreate={this.props.actions.createNote.bind(this, book)}
                        />
        }

        return <div className="notes-page" style={{minHeight: window.innerHeight}}>
                   <NotesHeader
                       ref="notesHeader"
                       books={this.props.books}
                       noteCount={book.notes.length}
                       onBookCreate={this.props.actions.createBook.bind(this)}
                       onBookChange={this.props.actions.selectBook.bind(this)}
                       onNoteCreate={this.props.actions.createNote.bind(this)}
                       onPageChange={this.props.onPageChange.bind(this)}
                       onSearch={this.handleSearchNotes.bind(this)}
                   />
                   {notesList}
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
        query: ['session', 'query'],
    },
    actions: {
        createBook: actions.books.create,
        selectBook: actions.books.select,
        createNote: actions.notes.create,
        selectNote: actions.notes.select,
        deselectNotes: actions.notes.deselect,
        pinNote: actions.notes.pin,
        unpinNote: actions.notes.unpin,
        setNoteTitle: actions.notes.setTitle,
        saveNoteTitle: actions.notes.saveTitle,
        setNoteContent: actions.notes.setContent,
        calculateNotePath: actions.notes.calculatePath,
        deleteNote: actions.notes.remove,
        setQuery: actions.session.query,
    }
});
