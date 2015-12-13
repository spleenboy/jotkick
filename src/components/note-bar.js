import React, {Component, PropTypes} from 'react';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';

import LinearProgress from 'material-ui/lib/linear-progress';
import TextField from 'material-ui/lib/text-field';
import IconButton from 'material-ui/lib/icon-button';
import FlatButton from 'material-ui/lib/flat-button';
import FontIcon from 'material-ui/lib/font-icon';

export default class NoteBar extends Component {
    static get propTypes() {
        return {
            note: PropTypes.object.isRequired,
            onTitleChange: PropTypes.func.isRequired,
            onTitleBlur: PropTypes.func.isRequired,
            onPin: PropTypes.func.isRequired,
            onUnpin: PropTypes.func.isRequired,
            onRemove: PropTypes.func.isRequired,
        };
    }

    handleTitleBlur(e) {
        this.props.onTitleBlur(e.target.value);
    }

    handleTitleChange(e) {
        this.props.onTitleChange(e.target.value);
    }

    handlePin(e) {
        if (this.props.note.data.pinned) {
            this.props.onUnpin(this.props.note);
        } else {
            this.props.onPin(this.props.note);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.note.data.title !== this.refs.noteTitle.getValue()) {
            this.refs.noteTitle.setValue(nextProps.note.data.title);
        }
    }

    render() {
        const note = this.props.note;
        const pinAct   = note.data.pinned ? 'Unpin' : 'Pin';
        const pinClass = note.data.pinned ? 'fa fa-flag' : 'fa fa-flag-o';
        const saveProgress = note.saving
                             ? <LinearProgress mode="indeterminate" style={{height: 3}} />
                             : <div style={{height: 3}}/>
        return <div>
                   <Toolbar>
                       <ToolbarGroup key={0} float="left">
                           <TextField
                               ref="noteTitle"
                               hintText="Give me a good name"
                               defaultValue={note.data.title}
                               inputStyle={{fontSize: '1.2em'}}
                               onFocus={this.props.onSelect.bind(this, note)}
                               onChange={this.handleTitleChange.bind(this)}
                               onBlur={this.handleTitleBlur.bind(this)}
                           />
                       </ToolbarGroup>
                       <ToolbarGroup key={1} float="right">
                           <IconButton tooltip={`${pinAct} this Note`} onTouchTap={this.handlePin.bind(this)}>
                               <FontIcon className={pinClass}/>
                           </IconButton>
                           {note.content ? 
                               <IconButton tooltip="Delete Note" onTouchTap={this.props.onRemove.bind(this)}>
                                   <FontIcon className="fa fa-trash"/>
                               </IconButton>: ''}
                       </ToolbarGroup>
                   </Toolbar>
                   {saveProgress}
               </div>
    }
};
