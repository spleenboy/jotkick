import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';

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


    render() {
        const book = this.props.books.find(b => b.active) || this.props.books[0];

        if (!book) {
            return null;
        }

        return <div className="notes-page">
                   <NotesHeader
                       books={this.props.books}
                       onBookCreate={this.props.actions.createBook.bind(this)}
                       onBookChange={this.props.actions.selectBook.bind(this)}
                       onNoteCreate={this.props.actions.createNote.bind(this)}
                   />
                   <NoteList
                       book={book}
                       onSelect={this.props.actions.selectNote.bind(this)}
                       onTitleChange={this.props.actions.setNoteTitle.bind(this)}
                       onTitleBlur={this.props.actions.renameNoteFile.bind(this)}
                       onPin={this.props.actions.pinNote.bind(this)}
                       onUnpin={this.props.actions.unpinNote.bind(this)}
                       onContentChange={this.props.actions.setNoteContent.bind(this)}
                       onRemove={this.handleRemoveNote.bind(this)}
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
