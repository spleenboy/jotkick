import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';
import * as Model from '../state/model';
import * as session from '../state/actions/session';

import Colors from 'material-ui/lib/styles/colors';
import Snackbar from 'material-ui/lib/snackbar';


class Messaging extends Component {
    render() {
        if (!this.props.messages) {
            return null;
        }

        const snacks = this.props.messages.map((msg, i) => {
            let text, onDismiss, onAction, style = {};
            const remove = this.props.actions.removeMessage.bind(this, msg.id);

            if (msg.type === Model.Message.Error) {
                text = `${msg.err}`;
                style = {backgroundColor: Colors.red, color: Colors.white}
                onDismiss = remove;
                onAction = remove;
            } else if (msg.type === Model.Message.Action) {
                text = msg.text;
                onAction = remove;
                onDismiss = remove;
            } else {
                text = msg.text;
                onAction = msg.callback;
                onDismiss = remove;
            }

            return <Snackbar
                       key={i}
                       message={text}
                       open={true}
                       action={msg.action}
                       autoHideDuration={8000}
                       style={style}
                       onActionTouchTap={onAction}
                       onRequestClose={onDismiss}
                   />
        });

        return <div>{snacks}</div>
    }
}

export default branch(Messaging, {
    cursors: {
        messages: ['session', 'messages'],
    },
    actions: {
        removeMessage: session.removeMessage,
    }
});
