import React, {Component, PropTypes} from 'react';

import Sticky from 'react-stickynode';
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
        };
    }

    render() {
        const note = this.props.note;
        if (!note) {
            return null;
        }
        return <Grid.Row>
                    <Sticky top={0} bottomBoundary={1200}>
                        <NoteBar
                            note={note}
                            onSelect={this.props.onSelect.bind(this)}
                            onTitleChange={this.props.onTitleChange.bind(this)}
                            onTitleBlur={this.props.onTitleBlur.bind(this)}
                            onPin={this.props.onPin.bind(this)}
                            onUnpin={this.props.onUnpin.bind(this)}
                        />
                    </Sticky>
                    <TextEditor
                        active={note.data.active}
                        value={note.content}
                        onChange={this.props.onContentChange.bind(this)}
                        onFocus={this.props.onSelect.bind(this)}
                    />
               </Grid.Row>
    }
};

