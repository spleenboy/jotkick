import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';
import * as notes from '../state/actions/notes';

import MenuItem from 'material-ui/lib/menus/menu-item';
import FontIcon from 'material-ui/lib/font-icon';
import IconButton from 'material-ui/lib/icon-button';

import BookSelect from './book-select';

class MoveNoteButton extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            moving: false,
        };
    }


    static get propTypes() {
        return {
            note: PropTypes.object,
        }
    }


    handleMoveClick() {
        this.setState({moving: true});
    }


    handleBookChange(book) {
        this.setState({moving: false});
        this.props.actions.setBook(this.props.note, book);
    }


    render() {
        const note = this.props.note;

        if (!note) return null;

        if (this.state.moving) {
            const select = <BookSelect
                               books={this.props.books}
                               hideCreate={true}
                               onBookChange={this.handleBookChange.bind(this)}
                           />
            return <MenuItem
                       primaryText={select}
                       innerDivStyle={{paddingLeft: 0}}
                   >
                   </MenuItem>
        }

        return <MenuItem
                   primaryText="Move To..."
                   leftIcon={<FontIcon className="fa fa-book"/>}
                   onTouchTap={this.handleMoveClick.bind(this)}
               />
    }
}


export default branch(MoveNoteButton, {
    cursors: {
        'books': ['books'],
    },
    actions: {
        setBook: notes.setBook,
    }
});
