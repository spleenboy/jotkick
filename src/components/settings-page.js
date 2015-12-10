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
        const current = this.props.settings.basePath
                        ? <p>Your current home is <em>{this.props.settings.basePath}</em>. If you change your home directory, your current notes may disappear.</p>
                        : <p>Let's get started! I need a home. This is where all files will be saved.</p>
        return <div style={{padding: 10}}>
                   {current}
                   <RaisedButton
                       label={this.props.settings.basePath ? 'Choose a New Home' : 'Find a Home'}
                       labelPosition="after"
                       primary={true}
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
    onPageChange: PropTypes.func.isRequired,
};

export default branch(SettingsPage, {
    cursors: {
        settings: ['settings'],
    },
    actions: {
        updateSetting: actions.settings.update,
    }
});
