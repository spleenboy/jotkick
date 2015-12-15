import React, {Component, PropTypes} from 'react';

import Paper from 'material-ui/lib/paper';
import NoteBar from './note-bar';
import Editor from './editor';
import TextEditor from './text-editor';
import * as Grid from './grid';

export default class NoteItem extends Component {
    static get propTypes() {
        const handler = PropTypes.func.isRequired;
        return {
            note            : PropTypes.object.isRequired,
            onSelect        : handler,
            onTitleChange   : handler,
            onTitleBlur     : handler,
            onPin           : handler,
            onUnpin         : handler,
            onContentChange : handler,
            onRemove        : handler,
        };
    }

    render() {
        const note = this.props.note;
        if (!note) {
            return null;
        }
        const search = note.search || {};
        const content = note.data.active ? note.content : search.content || note.content;
        return <Grid.Row>
                    <NoteBar
                        note={note}
                        onSelect={this.props.onSelect.bind(this)}
                        onTitleChange={this.props.onTitleChange.bind(this)}
                        onTitleBlur={this.props.onTitleBlur.bind(this)}
                        onPin={this.props.onPin.bind(this)}
                        onUnpin={this.props.onUnpin.bind(this)}
                        onRemove={this.props.onRemove.bind(this)}
                    />
                    <TextEditor
                        active={note.data.active}
                        value={content}
                        onChange={this.props.onContentChange.bind(this)}
                        onFocus={this.props.onSelect.bind(this)}
                    />
               </Grid.Row>
    }
};

