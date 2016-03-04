import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';
import * as notes from '../actions/notes';
import * as session from '../actions/session';

import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';
import MenuItem from 'material-ui/lib/menus/menu-item';

export default class DeleteButton extends Component {
    static get propTypes() {
        return {
            note: PropTypes.object,
        }
    }


    handleRemove() {
        const note = this.props.note;
        this.props.actions.removeNote(note);
        const undoDelete = () => {
            this.props.actions.createNote(note);
        };
        this.props.actions.addAction("Your note has been deleted", undoDelete);
    }


    render() {
        const label = "Delete";
        if (!this.props.menuitem) {
            return <IconButton
                       iconClassName="fa fa-trash"
                       tooltip={label}
                       onTouchTap={this.handleRemove.bind(this)}
                   />
        }

        return <MenuItem
                   primaryText={label}
                   leftIcon={<FontIcon className="fa fa-trash"/>}
                   onTouchTap={this.handleRemove.bind(this)}
               />
    }
}

export default branch(DeleteButton, {
    actions: {
        removeNote: notes.remove,
        createNote: notes.create,
        addAction: session.action,
    }
});
