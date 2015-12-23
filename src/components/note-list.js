import React, {Component, PropTypes} from 'react';

import NoteItem from './note-item';
import {Row} from './grid';

export default class NoteList extends Component {

    static get propTypes() {
        return {
            book: PropTypes.object,
            notes: PropTypes.array.isRequired,
        };
    }


    render() {
        const actions = this.props.actions;
        const book = this.props.book;
        const notes = this.props.notes;
        const noteItems = notes.map((note, i) => {
            return <NoteItem
                       key={i}
                       book={book}
                       note={note}
                   />
        });
        return <Row>{noteItems}</Row>
    }
}
