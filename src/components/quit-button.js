const ipc = window.require('electron').ipcRenderer;
import React, {PropTypes, Component} from 'react';
import IconButton from 'material-ui/lib/icon-button';

export default class QuitButton extends Component {
    handleAppQuit() {
        ipc.send('quit-app');
    }

    render() {
        return <IconButton
                   style={{position: 'absolute', top: 10, right: 10}}
                   iconClassName="fa fa-times-circle"
                   tooltip="Quit"
                   tooltipPosition="bottom-left"
                   onTouchTap={this.handleAppQuit.bind(this)}
               />
    }
}
