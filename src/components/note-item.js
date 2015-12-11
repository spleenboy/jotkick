import React, {Component, PropTypes} from 'react';

import Paper from 'material-ui/lib/paper';
import NoteBar from './note-bar';
import Editor from './editor';
import * as Grid from './grid';

export default class NoteItem extends Component {
    render() {
        const note = this.props.note;
        if (!note) {
            return null;
        }
        return <Grid.Row>
                   <Paper style={{width: '100%'}}>
                        <NoteBar
                            note={note}
                            onSelect={this.props.onSelect.bind(this)}
                            onTitleChange={this.props.onTitleChange.bind(this)}
                            onPin={this.props.onPin.bind(this)}
                            onUnpin={this.props.onUnpin.bind(this)}
                        />
                        <Editor
                            active={note.data.active}
                            initialValue={note.content}
                            onChange={this.props.onContentChange.bind(this)}
                            onFocus={this.props.onSelect.bind(this)}
                        />
                   </Paper>
               </Grid.Row>
    }
};

const handler = PropTypes.func.isRequired;
NoteItem.PropTypes = {
    onSelect        : handler,
    onTitleChange   : handler,
    onPin           : handler,
    onUnpin         : handler,
    onContentChange : handler,
};
