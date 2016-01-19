const shell = window.require('shell');
const ipc = window.require('electron').ipcRenderer;
import React, {PropTypes, Component} from 'react';

import MenuItem from 'material-ui/lib/menus/menu-item';
import FontIcon from 'material-ui/lib/font-icon';
import IconButton from 'material-ui/lib/icon-button';

export default class OpenBookButton extends Component {
    static get propTypes() {
        return {
            book: PropTypes.object
        }
    }


    handleOpenClick() {
        const book = this.props.book;
        const link = `file:///${book.file.path.full}`;
        shell.openExternal(link);
        ipc.send('minimize');
    }


    render() {
        const label = "Open Folder";
        const disabled = !this.props.book.file;

        return <IconButton
                   iconClassName="fa fa-folder-open"
                   tooltip={label}
                   disabled={disabled}
                   onTouchTap={this.handleOpenClick.bind(this)}
               />;
    }
}
