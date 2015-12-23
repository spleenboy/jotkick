import React, {Component, PropTypes} from 'react';
import {branch} from 'baobab-react/higher-order';
import _ from 'lodash';
import * as notes from '../state/actions/notes';
import * as Model from '../state/model';

import Themes from '../themes/';
import Paper from 'material-ui/lib/paper';
import NoteBar from './note-bar';
import Editor from './editor';
import TextEditor from './text-editor';
import * as Grid from './grid';

class NoteItem extends Component {
    static get propTypes() {
        return {
            book: PropTypes.object.isRequired,
            note: PropTypes.object.isRequired,
        };
    }


    shouldComponentUpdate(nextProps, nextState) {
        const {book, note} = this.props;
        if (book.id !== nextProps.book.id || book.name !== nextProps.book.name) {
            return true;
        }
        if (!Model.equalNotes(note, nextProps.note)) {
            return true;
        }
        return false;
    }


    render() {
        const {book, note} = this.props;

        if (!book || !note) {
            return null;
        }

        const search = note.search || {};
        const content = note.data.active ? note.content : search.content || note.content;
        const theme = Themes[this.props.theme || Themes.Light];

        const setContent = (value) => {
            this.props.actions.setNoteContent(book, note, value);
        };

        const selectNote = () => {
            this.props.actions.selectNote(book, note);
        };

        return <Grid.Row>
                    <NoteBar book={book} note={note} />
                    <TextEditor
                        active={note.data.active}
                        id={note.id}
                        theme={theme}
                        value={content}
                        onChange={setContent}
                        onFocus={selectNote}
                    />
               </Grid.Row>
    }
};


export default branch(NoteItem, {
    cursors: {
        theme: ['settings', 'theme'],
    },
    actions: {
        setNoteContent: notes.setContent,
        selectNote: notes.select,
    }
});
