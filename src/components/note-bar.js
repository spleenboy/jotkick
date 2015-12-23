import React, {Component, PropTypes} from 'react';
import {branch} from 'baobab-react/higher-order';
import * as notes from '../state/actions/notes';
import * as session from '../state/actions/session';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';

import LinearProgress from 'material-ui/lib/linear-progress';
import TextField from 'material-ui/lib/text-field';
import IconButton from 'material-ui/lib/icon-button';
import FlatButton from 'material-ui/lib/flat-button';
import FontIcon from 'material-ui/lib/font-icon';
import ShareButton from './share-button';
import OpenButton from './open-button';

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
            book: PropTypes.object.isRequired,
            note: PropTypes.object.isRequired,
        };
    }

    focus() {
        this.refs.wrapper.scrollIntoView({behavior: 'smooth'});
    }

    handleTitleBlur(e) {
        this.props.actions.saeNoteTitle(this.props.book, this.props.note, e.target.value);
    }

    handleTitleChange(e) {
        this.props.actions.setNoteTitle(this.props.book, this.props.note, e.target.value);
    }

    handlePin(e) {
        const {book, note} = this.props;
        if (note.pinned) {
            this.props.actions.unpinNote(book, note);
        } else {
            this.props.actions.pinNote(book, note);
        }
    }


    handleRemove() {
        const {book, note} = this.props;
        this.props.actions.deleteNote(book, note);
        const undoDelete = () => {
            this.props.actions.createNote(book, note);
            this.setState({undoDelete: null});
            this.refs.deletedNote.dismiss();
        };
        this.setState({undoDelete});
        this.refs.deletedNote.show();
    }


    handleUndoDelete() {
        this.state.undoDelete();
        this.setState({undoDelete: null});
    }


    handleDeselectNote() {
        this.props.actions.deselectNote(this.props.book);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.note.data.title !== this.refs.noteTitle.getValue()) {
            this.refs.noteTitle.setValue(nextProps.note.data.title);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.note.data.active && this.props.note.data.active) this.focus();
    }

    render() {
        const {book, note} = this.props;

        if (!book || !note) return null;

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
                       <ToolbarGroup key={0} float="left">
                           <TextField
                               ref="noteTitle"
                               hintText="Give me a good name"
                               defaultValue={note.data.title}
                               inputStyle={{fontSize: '1.2em'}}
                               onFocus={this.props.actions.selectNote.bind(this, book, note)}
                               onChange={this.handleTitleChange.bind(this)}
                               onBlur={this.handleTitleBlur.bind(this)}
                           />
                       </ToolbarGroup>
                       <ToolbarGroup key={1} float="right">
                           {note.data.active ?
                               <IconButton tooltip="Stop Editing" onTouchTap={this.handleDeselectNote.bind(this)}>
                                   <FontIcon className="fa fa-eye"/>
                               </IconButton> : ''}
                           <OpenButton note={note}/>
                           <ShareButton note={note}/>
                           <IconButton tooltip={`${pinAct} this Note`} onTouchTap={this.handlePin.bind(this)}>
                               <FontIcon className={pinClass}/>
                           </IconButton>
                           <IconButton tooltip="Delete Note" onTouchTap={this.handleRemove.bind(this)}>
                               <FontIcon className="fa fa-trash"/>
                           </IconButton>
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
        alert: session.alert,
    }
});
