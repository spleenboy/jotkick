import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';
import * as notes from '../actions/notes';
import * as session from '../actions/session';

import MenuItem from 'material-ui/lib/menus/menu-item';
import FontIcon from 'material-ui/lib/font-icon';
import IconButton from 'material-ui/lib/icon-button';

import BookSelect from './book-select';

class CopyNoteButton extends Component {
    static get propTypes() {
        return {
            note: PropTypes.object,
        }
    }


    handleClick() {
        const copy = this.props.actions.copyNote(this.props.note);
        this.props.actions.addAlert("Copied!");
    }


    render() {
        const note = this.props.note;

        if (!note) return null;

        return <MenuItem
                   primaryText="Copy"
                   leftIcon={<FontIcon className="fa fa-copy"/>}
                   onTouchTap={this.handleClick.bind(this)}
               />
    }
}


export default branch(CopyNoteButton, {
    actions: {
        copyNote: notes.copy,
        addAlert: session.alert,
    }
});
