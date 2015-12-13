import React, {Component, PropTypes} from 'react';

import NoteItem from './note-item';
import {Row} from './grid';

export default class NoteList extends Component {

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


    render() {
        const book = this.props.book;
        const actions = this.props.actions;
        const notes = this.sortNotes();
        const noteItems = notes.map((note, i) => {
            return <NoteItem
                       key={i}
                       note={note}
                       onSelect={actions.selectNote.bind(this, book, note)}
                       onTitleChange={actions.setNoteTitle.bind(this, book, note)}
                       onTitleBlur={actions.renameNoteFile.bind(this, book, note)}
                       onPin={actions.pinNote.bind(this, book, note)}
                       onUnpin={actions.unpinNote.bind(this, book, note)}
                       onContentChange={actions.setNoteContent.bind(this, book, note)}
                   />
        });
        return <Row>{noteItems}</Row>
    }
}

NoteList.PropTypes = {
    notes: PropTypes.array.isRequired,
    actions: PropTypes.array.isRequired,
};
