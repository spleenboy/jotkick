import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';
import NoteItem from './note-item';
import actions from '../state/actions/';

class NotesPage extends Component {
    render() {
        const book = this.props.books.find(b => b.active) || this.props.books[0];
        const note = book.notes.find(n => n.active) || book.notes[0];
        return <div className="notes-page">
                   <NoteItem
                       note={note}
                       onSelect={this.props.actions.selectNote.bind(this, book, note)}
                       onTitleChange={this.props.actions.setNoteTitle.bind(this, book, note)}
                       onPin={this.props.actions.pinNote.bind(this, book, note)}
                       onUnpin={this.props.actions.unpinNote.bind(this, book, note)}
                       onContentChange={this.props.actions.setNoteContent.bind(this, book, note)}
                   />
               </div>
    }
}

export default branch(NotesPage, {
    cursors: {
        books: ['books'],
    },
    actions: {
        selectBook: actions.books.select,
        setBookTitle: actions.books.setTitle,
        selectNote: actions.notes.select,
        pinNote: actions.notes.pin,
        unpinNote: actions.notes.unpin,
        setNoteTitle: actions.notes.setTitle,
        setNoteContent: actions.notes.setContent,
    }
});
