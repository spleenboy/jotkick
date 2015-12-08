import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';
import actions from '../state/actions/';

import Header from './header';
import NoteItem from './note-item';

class Main extends Component {
    render() {
        const note = this.props.actions.activeNote();
        const containerStyle = {
            overflow: 'auto',
        };
        return <div style={containerStyle}>
                   <Header />
                   <NoteItem
                       note={note}
                       onNoteSelect={this.props.actions.selectNote.bind(this)}
                       onChange={this.props.actions.updateNote.bind(this)}
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
