import React, {PropTypes, Component} from 'react';
import Mousetrap from 'mousetrap';

import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';

import BookSelect from './book-select';
import SearchBar from './search-bar';

export default class NotesHeader extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            muiTheme: this.context.muiTheme,
            searching: false,
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
            onPageChange: PropTypes.func.isRequired,
            onSearch: PropTypes.func.isRequired,
        };
    }

    cancelSearch() {
        if (this.refs.searchBar) {
            this.refs.searchBar.cancel();
        }
    }

    handleNoteCreate(e) {
        const book = this.props.books.find(b => b.active);
        this.props.onNoteCreate(book);
    }

    handleSearching(value) {
        this.props.onSearch(value);
    }

    handleSearchStart() {
        this.setState({searching: true});
    }

    handleSearchToggle(e) {
        this.setState({searching: !this.state.searching});
    }

    handleSearchCancel() {
        this.props.onSearch(null);
        this.setState({searching: false});
    }

    componentDidMount() {
        Mousetrap.bind('command+/', this.handleSearchStart.bind(this));
    }

    render() {
        const theme = this.state.muiTheme;
        const padding = 10;
        let search = null;
        if (this.state.searching) {
            search = <SearchBar
                         ref="searchBar"
                         active={this.state.searching}
                         onSearch={this.handleSearching.bind(this)}
                         onChange={this.handleSearching.bind(this)}
                         onCancel={this.handleSearchCancel.bind(this)}
                     />
        } else {
            search = <IconButton
                         ref="searchButton"
                         touch={true}
                         tooltip="Search Notes"
                         tooltipPosition="top-center"
                         onTouchTap={this.handleSearchToggle.bind(this)}
                     >
                         <FontIcon className="fa fa-search"/>
                     </IconButton>
        }

        return <div>
                   <h1 style={{textAlign: 'center', color: theme.rawTheme.palette.textColor}}>JotKick</h1>
                   <Toolbar style={{backgroundColor: theme.appBar.color, marginTop: padding, marginBottom: padding, height: theme.appBar.height + padding, paddingTop: padding}}>
                        <ToolbarGroup key={0} float="left">
                           <IconButton
                               touch={true}
                               tooltip="Edit Settings"
                               tooltipPosition="top-center"
                               onTouchTap={this.props.onPageChange.bind(this, 'settings')}
                           >
                               <FontIcon className="fa fa-cog"/>
                           </IconButton>
                       </ToolbarGroup>
                       <ToolbarGroup key={1} float="left">
                           <BookSelect
                               books={this.props.books}
                               onBookChange={this.props.onBookChange.bind(this)}
                               onBookCreate={this.props.onBookCreate.bind(this)}
                           />
                       </ToolbarGroup>
                       <ToolbarGroup key={2} float="right">
                           {search}
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
