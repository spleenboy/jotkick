const shell = window.require('shell');
import React, {PropTypes, Component} from 'react';

import IconButton from 'material-ui/lib/icon-button';

export default class OpenButton extends Component {
    static get propTypes() {
        return {
            note: PropTypes.object,
        }
    }


    handleOpenClick() {
        const note = this.props.note;
        const link = `file:///${note.file.path.full}`;
        shell.openExternal(link);
    }


    render() {
        const filepath = this.props.note.file.path;
        return <IconButton
                   iconClassName="fa fa-folder-open"
                   tooltip={`Open ${filepath.base}`}
                   onTouchTap={this.handleOpenClick.bind(this)}
               />
    }
}
