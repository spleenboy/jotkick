import React, {PropTypes, Component} from 'react';

import IconButton from 'material-ui/lib/icon-button';
import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import DropDownMenu from 'material-ui/lib/drop-down-menu';

export default class NotesHeader extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            muiTheme: this.context.muiTheme,
        };
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
            onNoteCreate: PropTypes.func.isRequired,
        };
    }

    handleBookChange(event, index, item) {
        if (item.payload === 'new') {
            this.props.onBookCreate();
        } else {
            this.props.onBookChange(item.payload);
        }
    }

    handleNoteCreate(e) {
        const book = this.props.books.find(b => b.active);
        this.props.onNoteCreate(book);
    }

    render() {
        const theme = this.state.muiTheme;

        let bookIndex = 0;
        let bookList = this.props.books.map((b, i) => {
            if (b.active) bookIndex = i;
            return { payload: b, text: <span><FontIcon className="fa fa-book"/> {b.name}</span> }
        });
        bookList.push({payload: 'new', text: <span><FontIcon className="fa fa-plus-square"/> Add a Book</span>});
        
        return <Toolbar style={{backgroundColor: theme.appBar.color}}>
                   <ToolbarGroup key={0} float="left">
                       <DropDownMenu
                           menuItems={bookList}
                           selectedIndex={bookIndex}
                           onChange={this.handleBookChange.bind(this)}
                       />
                   </ToolbarGroup>
                   <ToolbarGroup key={1} float="right">
                       <RaisedButton
                           primary={true}
                           label="New Note"
                           onTouchTap={this.handleNoteCreate.bind(this)}
                       >
                           <FontIcon className="fa fa-comment-o" style={{marginRight: 10}} />
                       </RaisedButton>
                       <IconButton touch={true}>
                           <FontIcon className="fa fa-search"/>
                       </IconButton>
                   </ToolbarGroup>
               </Toolbar>
    }
}
