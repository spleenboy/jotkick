import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';
import actions from '../state/actions/';

import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';
import IconButton from 'material-ui/lib/icon-button';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

import Heading from './heading';
import BookEdit from './book-edit';
import ThemeSelect from './theme-select';

const ipc = window.require('electron').ipcRenderer;


class SettingsPage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            theme: this.context.muiTheme,
        };
    }

    static get contextTypes() {
        return {
            muiTheme: PropTypes.object,
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({theme: nextContext.muiTheme});
    }

    componentDidMount() {
        ipc.on('open-dialog-reply', (event, dirPaths) => {
            if (dirPaths.length) {
                this.props.actions.setBasePath(dirPaths[0]);
            }
        });
    }

    handleFileSelect() {
        ipc.send('open-dialog');
    }


    handleBookChange(book) {
        this.props.actions.selectBook(book);
    }


    handleBookRename(book, name) {
        this.props.actions.renameBook(book, name);
        this.props.actions.alert(`Your book was renamed to ${name}`);
    }


    handleBookRemove(book, name) {
        this.props.actions.removeBook(book);
        this.props.actions.alert(`${book.name} has been deleted completely`);
    }


    handleBookSelect(book) {
        this.props.actions.selectBook(book);
        this.props.onPageChange('book');
    }


    handleBookCreate(name) {
        this.props.actions.createBook(name);
    }


    handleThemeChange(theme) {
        this.props.actions.setTheme(theme);
    }


    handleBackButton() {
        this.props.onPageChange('book');
    }

    render() {
        let startMessage, booksMessage, booksList, backButton;

        const colors = this.state.theme.rawTheme.palette;

        if (this.props.settings.basePath) {
            startMessage  = <p>Your current home is <code>{this.props.settings.basePath}</code>.</p>
        } else {
            startMessage = <p>Let's get started! I need a home. This is where all files will be saved.</p>
        }

        booksMessage = <p>Use books to keep your notes organized. Each book is a folder in your home directory.</p>
        if (this.props.books.length) {
            backButton = <IconButton
                             iconClassName="fa fa-arrow-left"
                             tooltip="Back to Your Notes"
                             tooltipPosition="bottom-right"
                             touch={true}
                             style={{position: 'absolute', top: 10, left: 10}}
                             onTouchTap={this.handleBackButton.bind(this)}
                         />
        }

        booksList = this.props.books.map((b, i) => {
            return <ListItem
                       key={i}
                       leftIcon={<FontIcon className="fa fa-book"/>}
                       primaryText={b.name}
                       onTouchTap={this.handleBookSelect.bind(this, b)}
                   />
        });
        const leftCol = "col-xs-5 col-xs-offset-1";
        const rightCol = "col-xs-6";

        return <div style={{color: colors.textColor, minHeight: window.innerHeight * 2}}>
                   {backButton}
                   <div className="row">
                       <div className="col-xs-12"><div className="box">
                           <Heading>JotKick Settings</Heading>
                       </div></div>
                   </div>
                   <hr/>
                   <div className="row">
                       <div className={leftCol}><div className="box">
                           <strong>Home Directory</strong>
                           {startMessage}
                       </div></div>
                       <div className={rightCol}><div className="box">
                           <RaisedButton
                               label={this.props.settings.basePath ? 'Find a New Home' : 'Find a Home'}
                               labelPosition="after"
                               primary={true}
                               tooltip="Choose a Home"
                               onTouchTap={this.handleFileSelect.bind(this)}
                           >
                               <FontIcon className="fa fa-hdd-o" style={{marginLeft: 10}}/>
                           </RaisedButton>
                       </div></div>
                   </div>
                   {this.props.settings.basePath ? <hr/> : ''}
                   {this.props.settings.basePath ?
                   <div className="row">
                       <div className={leftCol}><div className="box">
                           <strong>Books</strong>
                           {booksMessage}
                       </div></div>
                       <div className={rightCol}><div className="box">
                           <BookEdit
                               books={this.props.books}
                               onBookCreate={this.handleBookCreate.bind(this)}
                               onBookSelect={this.handleBookSelect.bind(this)}
                               onBookChange={this.handleBookChange.bind(this)}
                               onBookRename={this.handleBookRename.bind(this)}
                               onBookRemove={this.handleBookRemove.bind(this)}
                           />
                       </div></div>
                   </div> : ''}
                   <hr/>
                   <div className="row">
                       <div className={leftCol}><div className="box">
                           <strong>Theme</strong>
                       </div></div>
                       <div className={rightCol}><div className="box">
                           <ThemeSelect
                               theme={this.props.settings.theme}
                               onThemeChange={this.handleThemeChange.bind(this)}
                           />
                       </div></div>
                   </div>
                   <hr/>
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
        setBasePath: actions.settings.setBasePath,
        setTheme: actions.settings.setTheme,
        createBook: actions.books.create,
        selectBook: actions.books.select,
        renameBook: actions.books.rename,
        removeBook: actions.books.remove,
        alert: actions.session.alert,
    }
});
