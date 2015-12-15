import React, {Component, PropTypes} from 'react';

import NoteItem from './note-item';
import {Row} from './grid';

export default class NoteList extends Component {

    static get propTypes() {
        const handler = PropTypes.func.isRequired;
        return {
            notes: PropTypes.array.isRequired,
            onSelect: handler,
            onDeselect: handler,
            onTitleChange: handler,
            onTitleBlur: handler,
            onPin: handler,
            onUnpin: handler,
            onContentChange: handler,
            onRemove: handler,
        };
    }


    render() {
        const actions = this.props.actions;
        const notes = this.props.notes;
        const noteItems = notes.map((note, i) => {
            return <NoteItem
                       key={i}
                       note={note}
                       onSelect={this.props.onSelect.bind(this, note)}
                       onDeselect={this.props.onDeselect.bind(this, note)}
                       onTitleChange={this.props.onTitleChange.bind(this, note)}
                       onTitleBlur={this.props.onTitleBlur.bind(this, note)}
                       onPin={this.props.onPin.bind(this, note)}
                       onUnpin={this.props.onUnpin.bind(this, note)}
                       onContentChange={this.props.onContentChange.bind(this, note)}
                       onRemove={this.props.onRemove.bind(this, note)}
                   />
        });
        return <Row>{noteItems}</Row>
    }
}
