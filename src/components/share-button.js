const shell = window.require('shell');
import React, {PropTypes, Component} from 'react';

import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';
import MenuItem from 'material-ui/lib/menus/menu-item';

export default class ShareButton extends Component {
    static get propTypes() {
        return {
            note: PropTypes.object,
        }
    }


    handleShareClick() {
        const subject = encodeURIComponent(this.props.note.data.title);
        const body = encodeURIComponent(this.props.note.content);
        const link = `mailto:?subject=${subject}&body=${body}`;
        shell.openExternal(link);
    }


    render() {
        const label = "Email";
        if (!this.props.menuitem) {
            return <IconButton
                       iconClassName="fa fa-envelope"
                       tooltip={label}
                       onTouchTap={this.handleShareClick.bind(this)}
                   />
        }

        return <MenuItem
                   primaryText={label}
                   leftIcon={<FontIcon className="fa fa-envelope"/>}
                   onTouchTap={this.handleShareClick.bind(this)}
               />
    }
}
