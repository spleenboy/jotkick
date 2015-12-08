import React, {Component, PropTypes} from 'react';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';

import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';

export default class NoteBar extends Component {
    handleNoteSelect() {
        this.props.onNoteSelect(this.props.note);
    }

    render() {
        const note = this.props.note;
        return <Toolbar>
                   <IconButton
                       tooltip="Edit"
                       onTouchTap={this.handleNoteSelect.bind(this)}
                   >
                       <FontIcon className="fa fa-pencil-square-o"/>
                   </IconButton>
                   <ToolbarGroup key={0} float="left">
                       <ToolbarTitle
                           text={note.title}
                           onTouchTap={this.handleNoteSelect.bind(this)}
                       />
                   </ToolbarGroup>
                   <ToolbarGroup key={1} float="right">

                   </ToolbarGroup>
               </Toolbar>
    }
};
