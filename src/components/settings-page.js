import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';
import actions from '../state/actions/';

import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

import * as Grid from './grid';

const ipc = window.require('ipc');


class SettingsPage extends Component {
    componentDidMount() {
        ipc.on('open-dialog-reply', (dirPaths) => {
            if (dirPaths.length) {
                this.props.actions.updateSetting("basePath", dirPaths[0]);
            }
        });
    }

    handleBookSelect(book) {
        this.props.actions.selectBook(book);
        this.props.onPageChange('book');
    }

    handleFileSelect() {
        ipc.send('open-dialog');
    }

    handleAddBook() {
        const bookName = this.refs.bookName;
        const name = bookName.getValue();
        if (name) {
            this.props.actions.createBook(name);
            bookName.setValue("");
            bookName.setErrorText("");
        } else {
            bookName.setErrorText("Required");
        }
    }

    render() {
        let startMessage, booksMessage, booksList;
        if (this.props.settings.basePath) {
            startMessage  = <p>Your current home is <em>{this.props.settings.basePath}</em>. If you change your home directory, your current notes may disappear.</p>
        } else {
            startMessage = <p>Let's get started! I need a home. This is where all files will be saved.</p>
        }

        if (!this.props.books.length) {
            booksMessage = <p>Add your first book.</p>
        } else {
            booksMessage = <p>Add another book.</p>
        }

        booksList = this.props.books.map((b, i) => {
            return <ListItem
                       key={i}
                       leftIcon={<FontIcon className="fa fa-book"/>}
                       primaryText={b.name}
                       onTouchTap={this.handleBookSelect.bind(this, b)}
                   />
        });

        return <div style={{padding: 10}}>
                   <Grid.Row>
                       {startMessage}
                       <RaisedButton
                           label={this.props.settings.basePath ? 'Choose a New Home' : 'Find a Home'}
                           labelPosition="after"
                           primary={true}
                           tooltip="Choose a Home"
                           onTouchTap={this.handleFileSelect.bind(this)}
                       >
                           <FontIcon className="fa fa-hdd-o" style={{marginLeft: 10}}/>
                       </RaisedButton>
                   </Grid.Row>
                   <Grid.Row>
                        {booksMessage}
                        <TextField
                            floatingLabelText="Book Name"
                            ref="bookName"
                        />
                        <RaisedButton
                            label="Add"
                            labelPosition="after"
                            tooltip="Add a Book"
                            onTouchTap={this.handleAddBook.bind(this)}
                        >
                            <FontIcon className="fa fa-book" style={{marginLeft: 10}}/>
                        </RaisedButton>
                   </Grid.Row>
                   <Grid.Row>
                       <List>{booksList}</List>
                   </Grid.Row>
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
        books: ['books']
    },
    actions: {
        updateSetting: actions.settings.update,
        createBook: actions.books.create,
        selectBook: actions.books.select,
    }
});
