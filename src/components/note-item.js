import React, {Component, PropTypes} from 'react';

import Paper from 'material-ui/lib/paper';
import NoteBar from './note-bar';
import Editor from './editor';

export default class NoteItem extends Component {
    handleNoteSelect() {
        this.props.onNoteSelect(this.props.note);
    }

    render() {
        const note = this.props.note;
        return <div className="row">
                   <div className="col-xs-12">
                       <div className="box">
                           <Paper style={{width: '100%'}}>
                                <NoteBar
                                    note={note}
                                    onNoteSelect={this.handleNoteSelect.bind(this)}
                                />
                                <Editor
                                    active={note.active}
                                    initialValue={note.content}
                                    onChange={this.props.onChange.bind(this, 'content')}
                                />
                           </Paper>
                       </div>
                   </div>
               </div>
    }
};
