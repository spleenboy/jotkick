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
        }
    }

    static get propTypes() {
        return {
            books: PropTypes.array.isRequired,
            onBookChange: PropTypes.func.isRequired,
            onBookCreate: PropTypes.func.isRequired,
        };
    }

    handleBookCreate(event) {
        const name = this.refs.bookName.getValue();
        if (name) {
            this.props.onBookCreate(name);
            this.setState({adding: false});
            this.refs.bookName.setValue("");
            this.refs.bookName.setErrorText("");
        } else {
            this.refs.bookName.setErrorText("Please enter a name");
        }
    }

    handleBookChange(event, index, item) {
        if (item.payload === 'new') {
            this.setState({adding: true});
        } else {
            this.setState({adding: false});
            this.props.onBookChange(item.payload);
        }
    }

    render() {
        let books,
            bookAdd,
            bookIndex,
            bookMenu,
            bookItems;

        books = this.props.books.concat();
        books.sort((a, b) => {a.name < b.name ? -1 : 1});
        bookItems= books.map((b, i) => {
            if (b.active) bookIndex = i;
            return { payload: b, text: <span><FontIcon className="fa fa-book"/> {b.name}</span> }
        });
        bookItems.push({payload: 'new', text: <span><FontIcon className="fa fa-plus-square"/> Add a Book</span>});
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
                       />
                       <RaisedButton
                           label="Create Book"
                           onTouchTap={this.handleBookCreate.bind(this)}
                       />
                   </span>
        }
    }
}
