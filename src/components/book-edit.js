import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';
import * as session from '../actions/session';
import * as books from '../actions/books';

import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';
import TextField from 'material-ui/lib/text-field';
import Dialog from 'material-ui/lib/dialog';

import BookSelect from './book-select';

const Mode = {
    editing: 'editing',
    creating: 'creating',
    removing: 'removing',
    renaming: 'renaming',
};


class BookEdit extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            mode: Mode.editing,
        };
    }


    handleModeChange(mode) {
        this.setState({mode});
    }


    handleBookChange(book) {
        this.props.actions.selectBook(book);
    }


    handleBookRemove(book, name) {
        this.props.actions.removeBook(book);
        this.props.actions.alert(`${book.name} has been deleted completely`);
        this.setState({mode: Mode.editing});
    }


    handleBookSelect(book) {
        this.props.actions.setPage('book');
    }


    handleBookCreate(name) {
        this.setState({mode: Mode.editing});
        this.props.actions.createBook(name);
    }


    handleBookRename(book) {
        const newName = this.refs.newName.getValue();
        this.props.actions.renameBook(book, newName);
        this.props.actions.alert(`Your book was renamed to ${newName}`);
        this.setState({mode: Mode.editing});
    }


    render() {
        const book = this.props.books.find(b => b.active);
        let buttons;

        if (this.state.mode === Mode.editing && book) {
            const iconStyle = {marginLeft: 10};
            buttons = <div>
                          <RaisedButton
                               label="View"
                               labelPosition="after"
                               primary={true}
                               onTouchTap={this.handleBookSelect.bind(this)}
                          >
                              <FontIcon className="fa fa-eye" style={iconStyle}/>
                          </RaisedButton>
                          <RaisedButton
                               label="Rename"
                               labelPosition="after"
                               secondary={true}
                               onTouchTap={this.handleModeChange.bind(this, Mode.renaming)}
                          >
                              <FontIcon className="fa fa-random" style={iconStyle}/>
                          </RaisedButton>
                          <RaisedButton
                               label="Delete"
                               labelPosition="after"
                               onTouchTap={this.handleModeChange.bind(this, Mode.removing)}
                          >
                              <FontIcon className="fa fa-trash" style={iconStyle}/>
                          </RaisedButton>
                      </div>
        } else if (this.state.mode === Mode.renaming && book) {
            buttons = <div>
                          <TextField
                              ref="newName"
                              hintText="Enter a new name"
                              defaultValue={book.name}
                              floatingLabelText="Rename book"
                              onEnterKeyDown={this.handleBookRename.bind(this, book)}
                          />
                          <RaisedButton
                               label="Cancel"
                               onTouchTap={this.handleModeChange.bind(this, Mode.editing)}
                          />
                          <RaisedButton
                               label="Rename"
                               primary={true}
                               onTouchTap={this.handleBookRename.bind(this, book)}
                          />
                      </div>

        } else if (this.state.mode === Mode.removing && book) {
            const actions = [
                <RaisedButton
                    label="No! I want to keep it!"
                    ref="cancelButton"
                    onTouchTap={this.handleModeChange.bind(this, Mode.editing)}
                />,
                <RaisedButton
                    label="Yes. Delete it all."
                    ref="deleteButton"
                    primary={true}
                    onTouchTap={this.handleBookRemove.bind(this, book)}
                />
            ];
            buttons = <Dialog
                          title={`Really delete ${book.name}?`}
                          actions={actions}
                          actionFocus="cancelButton"
                          open={true}
                      />
        }

        return <div>
                   <BookSelect
                       books={this.props.books}
                       onBookCreate={this.handleBookCreate.bind(this)}
                       onBookChange={this.handleBookChange.bind(this)}
                       onBookCreating={this.handleModeChange.bind(this, Mode.creating)}
                       onBookCreateCancel={this.handleModeChange.bind(this, Mode.editing)}
                   /><br/><br/>
                   {buttons}
               </div>
       }
}

export default branch(BookEdit, {
    cursors: {
        books: ['books'],
    },
    actions: {
        createBook: books.create,
        selectBook: books.select,
        renameBook: books.rename,
        removeBook: books.remove,
        alert: session.alert,
        setPage: session.setPage,
    }
});
