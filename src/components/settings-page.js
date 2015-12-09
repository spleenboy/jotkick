import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';
import actions from '../state/actions/';

import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';

const ipc = window.require('ipc');


class SettingsPage extends Component {
    componentDidMount() {
        ipc.on('open-dialog-reply', (dirPath) => {
            this.props.actions.updateSetting("basePath", dirPath);
        });
    }

    handleFileSelect() {
        ipc.send('open-dialog');
    }

    render() {
        return <div style={{padding: 10}}>
                   {this.props.settings.basePath}
                   <RaisedButton
                       label="Choose a Home Folder"
                       labelPosition="after"
                       tooltip="Choose a Home"
                       onTouchTap={this.handleFileSelect.bind(this)}
                   >
                       <FontIcon className="fa fa-hdd-o" style={{marginLeft: 10}}/>
                   </RaisedButton>
               </div>
    }
}

SettingsPage.PropTypes = {
    settings: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default branch(SettingsPage, {
    cursors: {
        settings: ['settings'],
    },
    actions: {
        updateSetting: actions.settings.update,
    }
});
