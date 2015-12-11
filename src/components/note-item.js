import React, {Component, PropTypes} from 'react';

import Paper from 'material-ui/lib/paper';
import NoteBar from './note-bar';
import Editor from './editor';

export default class NoteItem extends Component {
    render() {
        const note = this.props.note;
        if (!note) {
            return null;
        }
        return <div className="row">
                   <div className="col-xs-12">
                       <div className="box">
                           <Paper style={{width: '100%'}}>
                                <NoteBar
                                    note={note}
                                    onSelect={this.props.onSelect.bind(this)}
                                    onTitleChange={this.props.onTitleChange.bind(this)}
                                    onPin={this.props.onPin.bind(this)}
                                    onUnpin={this.props.onUnpin.bind(this)}
                                />
                                <Editor
                                    active={note.active}
                                    initialValue={note.content}
                                    onChange={this.props.onContentChange.bind(this)}
                                />
                           </Paper>
                       </div>
                   </div>
               </div>
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
