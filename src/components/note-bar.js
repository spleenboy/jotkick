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
import ShareButton from './share-button';
import OpenButton from './open-button';

export default class NoteBar extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            muiTheme: this.context.muiTheme,
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
            onTitleFocus: PropTypes.func,
            onTitleChange: PropTypes.func,
            onTitleBlur: PropTypes.func,
            onDeselect: PropTypes.func,
            onPin: PropTypes.func.isRequired,
            onUnpin: PropTypes.func.isRequired,
            onRemove: PropTypes.func.isRequired,
        };
    }

    focus() {
        this.refs.wrapper.scrollIntoView({behavior: 'smooth'});
    }

    handleTitleFocus(e) {
        this.props.onTitleFocus && this.props.onTitleFocus();
    }

    handleTitleBlur(e) {
        this.props.onTitleBlur && this.props.onTitleBlur(e.target.value);
    }

    handleTitleChange(e) {
        this.props.onTitleChange && this.props.onTitleChange(e.target.value);
    }

    handleDeselect(e) {
        this.props.onDeselect && this.props.onDeselect();
    }

    handlePin(e) {
        if (this.props.note.pinned) {
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

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.note.data.active && this.props.note.data.active) this.focus();
    }

    render() {
        const note = this.props.note;
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
                               onFocus={this.handleTitleFocus.bind(this)}
                               onChange={this.handleTitleChange.bind(this)}
                               onBlur={this.handleTitleBlur.bind(this)}
                           />
                       </ToolbarGroup>
                       <ToolbarGroup key={1} float="right">
                           {note.data.active ?
                               <IconButton tooltip="Stop Editing" onTouchTap={this.handleDeselect.bind(this)}>
                                   <FontIcon className="fa fa-eye"/>
                               </IconButton> : ''}
                           <OpenButton note={note}/>
                           <ShareButton note={note}/>
                           <IconButton tooltip={`${pinAct} this Note`} onTouchTap={this.handlePin.bind(this)}>
                               <FontIcon className={pinClass}/>
                           </IconButton>
                           <IconButton tooltip="Delete Note" onTouchTap={this.props.onRemove.bind(this)}>
                               <FontIcon className="fa fa-trash"/>
                           </IconButton>
                       </ToolbarGroup>
                   </Toolbar>
                   {saveProgress}
               </div>
    }
};
