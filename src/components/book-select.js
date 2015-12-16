import React, {PropTypes, Component} from 'react';

import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';
import DropDownMenu from 'material-ui/lib/drop-down-menu';
import TextField from 'material-ui/lib/text-field';

export default class BookSelect extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            adding: false,
            theme: this.context.muiTheme,
        }
    }

    static get contextTypes() {
        return {
            muiTheme: PropTypes.object,
        };
    }

    static get propTypes() {
        return {
            books: PropTypes.array.isRequired,
            onBookChange: PropTypes.func.isRequired,
            onBookCreate: PropTypes.func.isRequired,
            onBookCreating: PropTypes.func,
            onBookCreateCancel: PropTypes.func,
        };
    }

    clear() {
        this.setState({adding: false});
        this.refs.bookName.clearValue();
    }

    warn() {
        this.refs.bookName.focus();
    }

    handleBookCreating() {
        this.props.onBookCreating && this.props.onBookCreating();
        this.setState({adding: true});
    }

    handleBookCreate(event) {
        const name = this.refs.bookName.getValue();
        if (name) {
            this.props.onBookCreate(name);
            this.clear();
        } else {
            this.warn();
        }
    }

    handleBookCreateCancel(event) {
        this.setState({adding: false});
        this.clear();
        this.props.onBookCreateCancel && this.props.onBookCreateCancel();
    }

    handleBookChange(event, index, item) {
        if (item === 'new') {
            this.handleBookCreating();
        } else {
            this.setState({adding: false});
            this.props.onBookChange(item);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.adding && this.state.adding) {
            this.refs.bookName.focus();
        }
    }

    render() {
        let books,
            bookAdd,
            bookIndex,
            bookMenu,
            bookItems;

        const space = 10;
        books = this.props.books.concat();
        books.sort((a, b) => {a.name < b.name ? -1 : 1});
        bookItems= books.map((b, i) => {
            if (b.active) bookIndex = i;
            return { payload: b, text: <span><FontIcon className="fa fa-book" style={{marginRight: space}}/> {b.name}</span> }
        });
        bookItems.push({payload: 'new', text: <span><FontIcon className="fa fa-plus-square" style={{marginRight: space}}/> Add a Book</span>});
        if (this.props.books.length && !this.state.adding) {
            return <DropDownMenu
                       menuItems={bookItems}
                       selectedIndex={bookIndex}
                       onChange={this.handleBookChange.bind(this)}
                   />
        } else {
            return <span>
                       <TextField
                           hintText="Enter a Book Name"
                           ref="bookName"
                           onEnterKeyDown={this.handleBookCreate.bind(this)}
                       />
                       <RaisedButton
                           label="Cancel"
                           onTouchTap={this.handleBookCreateCancel.bind(this)}
                       />
                       <RaisedButton
                           label="Create Book"
                           primary={true}
                           onTouchTap={this.handleBookCreate.bind(this)}
                       />
                   </span>
        }
    }
}
