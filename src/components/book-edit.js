import React, {PropTypes, Component} from 'react';

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


export default class BookEdit extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            activeBook: this.findActiveBook(),
            mode: Mode.editing,
        };
    }


    static get propTypes() {
        return {
            books: PropTypes.array,
            onBookCreate: PropTypes.func,
            onBookChange: PropTypes.func,
            onBookSelect: PropTypes.func,
            onBookRename: PropTypes.func,
            onBookRemove: PropTypes.func,
        }
    }


    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.books !== this.props.books) {
            this.setState({activeBook: this.findActiveBook()});
        }
    }


    findActiveBook() {
        if (!this.props.books) return null;

        const active = this.props.books.find(b => b.active);
        if (active) return active;

        return this.props.books[0];
    }

    handleModeChange(mode) {
        this.setState({mode});
    }

    handleBookChange(activeBook) {
        this.setState({activeBook});
        this.props.onBookChange && this.props.onBookChange(activeBook);
    }

    handleBookSelect(activeBook) {
        this.setState({activeBook});
        this.props.onBookSelect && this.props.onBookSelect(activeBook);
    }

    handleBookCreate(name) {
        this.setState({mode: Mode.editing});
        this.props.onBookCreate && this.props.onBookCreate(name);
    }

    handleBookRename(book) {
        const newName = this.refs.newName.getValue();
        this.props.onBookRename && this.props.onBookRename(book, newName);
        this.setState({mode: Mode.editing});
    }

    handleBookRemove(book) {
        this.props.onBookRemove && this.props.onBookRemove(book);
        this.setState({mode: Mode.editing});
    }

    render() {
        const book = this.state.activeBook;
        let buttons;

        if (this.state.mode === Mode.editing && book) {
            const iconStyle = {marginLeft: 10};
            buttons = <div>
                          <RaisedButton
                               label="View"
                               labelPosition="after"
                               primary={true}
                               onTouchTap={this.handleBookSelect.bind(this, book)}
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
                              initialValue={book.name}
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
