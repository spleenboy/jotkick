import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';
import actions from '../state/actions/';

import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';

import Heading from './heading';
import BookSelect from './book-select';
import SearchBar from './search-bar';

// Why bother showing search with few notes?
const MIN_NOTES_FOR_SEARCH = 3;

class NotesHeader extends Component {
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
        return {};
    }

    cancelSearch() {
        if (this.refs.searchBar) {
            this.refs.searchBar.cancel();
        }
    }

    handleNoteCreate(e) {
        const book = this.props.books.find(b => b.active);
        this.props.actions.createNote(book);
    }

    handleNoteSelect(book, note) {
        this.refs.notesHeader && this.refs.notesHeader.cancelSearch();
        this.props.actions.selectNote(book, note);
    }

    handleSearch(value) {
        this.props.actions.setQuery(value);
    }

    handleSearchCancel() {
        this.props.actions.setQuery('');
    }

    render() {
        const theme = this.state.muiTheme;
        const padding = 10;

        return <div>
                   <Heading>JotKick</Heading>
                   <IconButton
                       touch={true}
                       tooltip="Edit Settings"
                       tooltipPosition="bottom-right"
                       style={{position: 'absolute', top: 10, left: 10}}
                       onTouchTap={this.props.actions.setPage.bind(this, 'settings')}
                    >
                       <FontIcon className="fa fa-cog"/>
                   </IconButton>
                   <Toolbar style={{backgroundColor: theme.appBar.color, height: theme.appBar.height + padding, paddingTop: padding}}>
                       <ToolbarGroup key={1} float="left">
                           <BookSelect
                               books={this.props.books}
                               onBookChange={this.props.actions.selectBook}
                               onBookCreate={this.props.actions.createBook}
                           />
                       </ToolbarGroup>
                       <ToolbarGroup key={2} float="right">
                           <SearchBar
                               ref="searchBar"
                               onChange={this.handleSearch.bind(this)}
                               onCancel={this.handleSearchCancel.bind(this)}
                           />
                           <IconButton
                               touch={true}
                               tooltip="Add Note"
                               tooltipPosition="top-center"
                               onTouchTap={this.handleNoteCreate.bind(this)}
                           >
                               <FontIcon className="fa fa-plus-square-o" />
                           </IconButton>
                       </ToolbarGroup>
                   </Toolbar>
               </div>
    }
}

export default branch(NotesHeader, {
    cursors: {
        query: ['session', 'query'],
    },
    actions: {
        createBook: actions.books.create,
        selectBook: actions.books.select,
        createNote: actions.notes.create,
        setQuery: actions.session.query,
        setPage: actions.session.setPage,
    }
});
