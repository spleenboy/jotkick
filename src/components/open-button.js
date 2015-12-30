const shell = window.require('shell');
import React, {PropTypes, Component} from 'react';

import MenuItem from 'material-ui/lib/menus/menu-item';
import FontIcon from 'material-ui/lib/font-icon';
import IconButton from 'material-ui/lib/icon-button';

export default class OpenButton extends Component {
    static get propTypes() {
        return {
            note: PropTypes.object,
            menuitem: PropTypes.bool,
        }
    }


    handleOpenClick() {
        const note = this.props.note;
        const link = `file:///${note.file.path.dir}`;
        shell.openExternal(link);
    }


    render() {
        const label = "Open Folder";
        const disabled = !this.props.note.file;

        if (!this.props.menuitem) {
            return <IconButton
                       iconClassName="fa fa-folder-open"
                       tooltip={label}
                       disabled={disabled}
                       onTouchTap={this.handleOpenClick.bind(this)}
                   />;
        }

        return <MenuItem
                   primaryText={label}
                   leftIcon={<FontIcon className="fa fa-folder-open"/>}
                   disabled={disabled}
                   onTouchTap={this.handleOpenClick.bind(this)}
               />
    }
}
