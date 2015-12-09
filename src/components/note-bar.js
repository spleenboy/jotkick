import React, {Component, PropTypes} from 'react';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';

import TextField from 'material-ui/lib/text-field';
import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';

export default class NoteBar extends Component {
    handleTitleChange(e) {
        this.props.onTitleChange(e.target.value);
    }

    handlePin(e) {
        if (this.props.note.pinned) {
            this.props.onUnpin(this.props.note);
        } else {
            this.props.onPin(this.props.note);
        }
    }

    render() {
        const note = this.props.note;
        const pinAct   = note.pinned ? 'Unpin' : 'Pin';
        const pinClass = note.pinned ? 'fa fa-flag' : 'fa fa-flag-o';
        return <Toolbar style={{marginBottom: 20}}>
                   <TextField
                       hintText="Give me a good name"
                       value={note.title}
                       onFocus={this.props.onSelect.bind(this, note)}
                       onChange={this.handleTitleChange.bind(this)}
                   />
                   <ToolbarGroup key={1} float="right">
                       <IconButton tooltip={`${pinAct} this Note`} onTouchTap={this.handlePin.bind(this)}>
                           <FontIcon className={pinClass}/>
                       </IconButton>
                       {note.content ? 
                           <IconButton tooltip="Delete Note">
                               <FontIcon className="fa fa-trash"/>
                           </IconButton>: ''}
                   </ToolbarGroup>
               </Toolbar>
    }
};
