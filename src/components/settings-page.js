import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';
import actions from '../state/actions/';

import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

import BookSelect from './book-select';

const ipc = window.require('ipc');


class SettingsPage extends Component {
    componentDidMount() {
        ipc.on('open-dialog-reply', (dirPaths) => {
            if (dirPaths.length) {
                this.props.actions.updateSetting("basePath", dirPaths[0]);
            }
        });
    }

    handleBookSelect(book) {
        this.props.actions.selectBook(book);
        this.props.onPageChange('book');
    }

    handleBookCreate(name) {
        this.props.actions.createBook(name);
        this.props.onPageChange('book');
    }

    handleFileSelect() {
        ipc.send('open-dialog');
    }

    render() {
        let startMessage, booksMessage, booksList;
        if (this.props.settings.basePath) {
            startMessage  = <p>Your home is <em>{this.props.settings.basePath}</em>. If you change your home directory, your current notes may disappear.</p>
        } else {
            startMessage = <p>Let's get started! I need a home. This is where all files will be saved.</p>
        }

        booksMessage = <p>Books keep your notes organized. Each book is a top-level folder in your home directory.</p>
        if (!this.props.books.length) {
            booksMessage += <p>Add your first book now!</p>
        }

        booksList = this.props.books.map((b, i) => {
            return <ListItem
                       key={i}
                       leftIcon={<FontIcon className="fa fa-book"/>}
                       primaryText={b.name}
                       onTouchTap={this.handleBookSelect.bind(this, b)}
                   />
        });

        return <div style={{padding: 10}}>
                   <div className="row">
                       <div className="col-xs-12"><div className="box">
                           <h1>JotKick Settings</h1>
                       </div></div>
                   </div>
                   <hr/>
                   <div className="row">
                       <div className="col-xs-6"><div className="box">
                           <strong>Home Directory</strong>
                           {startMessage}
                       </div></div>
                       <div className="col-xs-6"><div className="box">
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
                   <hr/>
                   <div className="row">
                       <div className="col-xs-6"><div className="box">
                           <strong>Books</strong>
                           {booksMessage}
                       </div></div>
                       <div className="col-xs-6"><div className="box">
                           <BookSelect
                               books={this.props.books}
                               onBookCreate={this.handleBookCreate.bind(this)}
                               onBookChange={this.handleBookSelect.bind(this)}
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
        updateSetting: actions.settings.update,
        createBook: actions.books.create,
        selectBook: actions.books.select,
    }
});
