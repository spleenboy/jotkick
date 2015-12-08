import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';
import actions from '../state/actions/';

import Editor from './editor';

class Main extends Component {
    handleEditorChange(value) {
        this.props.actions.updateNote('value', value);
    }

    render() {
        const note = this.props.actions.activeNote();
        const containerStyle = {
            display: 'flex',
            padding: 5,
            overflow: 'auto',
        };
        return <div style={containerStyle}>
                   <Editor
                       active={true}
                       initialValue={note.value}
                       onChange={this.handleEditorChange.bind(this)}
                   />
               </div>
    }
}

export default branch(Main, {
    cursors(props, context) {
        return {
            books: ['books'],
            settings: ['settings'],
        };
    },
    actions: {
        selectBook: actions.books.select,
        updateBook: actions.books.update,
        activeBook: actions.books.active,
        selectNote: actions.notes.select,
        updateNote: actions.notes.update,
        activeNote: actions.notes.active,
        updateSetting: actions.settings.update,
    }
});
