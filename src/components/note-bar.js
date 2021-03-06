import React, {Component, PropTypes} from 'react';
import {branch} from 'baobab-react/higher-order';
import * as notes from '../state/actions/notes';
import * as session from '../state/actions/session';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';

import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Divider from 'material-ui/lib/divider';

import LinearProgress from 'material-ui/lib/linear-progress';
import TextField from 'material-ui/lib/text-field';
import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';

import ShareButton from './share-button';
import OpenButton from './open-button';
import DeleteButton from './delete-button';
import CopyNoteButton from './copy-note-button';
import MoveNoteButton from './move-note-button';

class NoteBar extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            muiTheme: this.context.muiTheme,
            undoDelete: null,
        }
    }

    static get contextTypes() {
        return {
            muiTheme: PropTypes.object,
        };
    }

    static get propTypes() {
        return {
            note: PropTypes.object.isRequired,
        };
    }

    handleTitleBlur(e) {
        this.props.actions.saveNoteTitle(this.props.note, e.target.value);
    }

    handleTitleChange(e) {
        this.props.actions.setNoteTitle(this.props.note, e.target.value);
    }

    handlePin(e) {
        const note = this.props.note;
        if (note.pinned) {
            this.props.actions.unpinNote(note);
        } else {
            this.props.actions.pinNote(note);
        }
    }


    handleDeselectNote() {
        this.props.actions.deselectNote();
    }

    render() {
        const note = this.props.note;

        if (!note) return null;

        const theme = this.state.muiTheme;
        const pinAct   = note.pinned ? 'Unpin' : 'Pin';
        const pinClass = note.pinned ? 'fa fa-flag' : 'fa fa-flag-o';

        const progressStyle = {
            height: 5,
            backgroundColor: theme.toolbar.backgroundColor,
        };

        const saveProgress = note.saving
                             ? <LinearProgress mode="indeterminate" style={progressStyle} />
                             : <div style={progressStyle}/>

        let toolbarStyle = {};

        if (note.data.active) {
            toolbarStyle.backgroundColor = theme.rawTheme.palette.accent1Color;
            toolbarStyle.color = theme.rawTheme.palette.alternateTextColor;
        } else {
            toolbarStyle.backgroundColor = theme.toolbar.backgroundColor;
        }

        return <div ref="wrapper">
                   <Toolbar style={toolbarStyle}>
                       <ToolbarGroup key={0} float="left" style={{width: '70%'}}>
                           <TextField
                               fullWidth={true}
                               hintText="Give me a good name"
                               inputStyle={{fontSize: '1.2em'}}
                               value={note.data.title}
                               onFocus={this.props.actions.selectNote.bind(this, note)}
                               onChange={this.handleTitleChange.bind(this)}
                               onBlur={this.handleTitleBlur.bind(this)}
                           />
                       </ToolbarGroup>
                       <ToolbarGroup key={1} float="right">
                           {note.data.active ?
                               <IconButton tooltip="Stop Editing" onTouchTap={this.handleDeselectNote.bind(this)}>
                                   <FontIcon className="fa fa-eye"/>
                               </IconButton> : ''}
                           <IconButton tooltip={`${pinAct} this Note`} onTouchTap={this.handlePin.bind(this)}>
                               <FontIcon className={pinClass}/>
                           </IconButton>

                           <IconMenu iconButtonElement={
                               <IconButton tooltip="More Options">
                                   <FontIcon className="fa fa-ellipsis-v"/>
                               </IconButton>
                           }>
                               <MenuItem
                                   primaryText={note.file ? note.file.path.base : note.data.title}
                                   disabled={true}
                               />
                               <Divider/>
                               <ShareButton note={note} menuitem={true}/>
                               <CopyNoteButton note={note}/>
                               <OpenButton note={note} menuitem={true}/>
                               <MoveNoteButton note={note} />
                               <Divider/>
                               <DeleteButton note={note} menuitem={true}/>
                           </IconMenu>
                       </ToolbarGroup>
                   </Toolbar>
                   {saveProgress}
               </div>
    }
};


export default branch(NoteBar, {
    actions: {
        selectNote: notes.select,
        deselectNote: notes.deselect,
        setNoteTitle: notes.setTitle,
        saveNoteTitle: notes.saveTitle,
        pinNote: notes.pin,
        unpinNote: notes.unpin,
    }
});
