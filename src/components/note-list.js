import React, {Component, PropTypes} from 'react';

import NoteItem from './note-item';
import {Row} from './grid';

export default class NoteList extends Component {
    render() {
        const book = this.props.book;
        const actions = this.props.actions;
        const noteItems = this.props.notes.map((note, i) => {
            return <NoteItem
                       key={i}
                       note={note}
                       onSelect={actions.selectNote.bind(this, book, note)}
                       onTitleChange={actions.setNoteTitle.bind(this, book, note)}
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
