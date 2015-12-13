import React, {PropTypes, Component} from 'react';

import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';

import BookSelect from './book-select';

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
            onPageChange: PropTypes.func.isRequired,
        };
    }

    handleNoteCreate(e) {
        const book = this.props.books.find(b => b.active);
        this.props.onNoteCreate(book);
    }

    render() {
        const theme = this.state.muiTheme;
        
        return <Toolbar style={{backgroundColor: theme.appBar.color}}>
                    <ToolbarGroup key={0} float="left">
                       <IconButton
                           touch={true}
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
                       <IconButton
                           touch={true}
                           tooltip="Search Notes"
                       >
                           <FontIcon className="fa fa-search"/>
                       </IconButton>
                       <IconButton
                           touch={true}
                           tooltip="Add Note"
                           onTouchTap={this.handleNoteCreate.bind(this)}
                       >
                           <FontIcon className="fa fa-plus-square-o" />
                       </IconButton>
                   </ToolbarGroup>
               </Toolbar>
    }
}
