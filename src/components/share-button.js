const shell = window.require('shell');
import React, {PropTypes, Component} from 'react';

import IconButton from 'material-ui/lib/icon-button';

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
        return <IconButton
                   iconClassName="fa fa-envelope"
                   tooltip="Share this Note"
                   onTouchTap={this.handleShareClick.bind(this)}
               />
    }
}
