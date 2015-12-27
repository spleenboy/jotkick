import React, {Component, PropTypes} from 'react';

import NoteItem from './note-item';
import {Row} from './grid';

export default class NoteList extends Component {

    static get propTypes() {
        return {
            notes: PropTypes.array.isRequired,
        };
    }


    render() {
        const notes = this.props.notes;
        const noteItems = notes.map((note, i) => {
            return <NoteItem
                       key={i}
                       note={note}
                   />
        });
        return <Row>{noteItems}</Row>
    }
}
