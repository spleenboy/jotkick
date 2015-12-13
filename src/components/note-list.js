import React, {Component, PropTypes} from 'react';

import NoteItem from './note-item';
import {Row} from './grid';

export default class NoteList extends Component {

    static get propTypes() {
        const handler = PropTypes.func.isRequired;
        return {
            book: PropTypes.object.isRequired,
            onSelect: handler,
            onTitleChange: handler,
            onTitleBlur: handler,
            onPin: handler,
            onUnpin: handler,
            onContentChange: handler,
            onRemove: handler,
        };
    }

    sortNotes() {
        let notes = this.props.book.notes.concat();
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


    handleTitleBlur(book, note) {
        this.props.actions.renameNoteFile(book, note);
    }


    render() {
        const book = this.props.book;
        const actions = this.props.actions;
        const notes = this.sortNotes();
        const noteItems = notes.map((note, i) => {
            return <NoteItem
                       key={i}
                       note={note}
                       onSelect={this.props.onSelect.bind(this, book, note)}
                       onTitleChange={this.props.onTitleChange.bind(this, book, note)}
                       onTitleBlur={this.handleTitleBlur.bind(this, book, note)}
                       onPin={this.props.onPin.bind(this, book, note)}
                       onUnpin={this.props.onUnpin.bind(this, book, note)}
                       onContentChange={this.props.onContentChange.bind(this, book, note)}
                       onRemove={this.props.onRemove.bind(this, book, note)}
                   />
        });
        return <Row>{noteItems}</Row>
    }
}
