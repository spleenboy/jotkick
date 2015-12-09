import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';

import Header from './header';
import NotesPage from './notes-page';
import SettingsPage from './settings-page';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 'home',
        };
    }

    handlePageChange(page) {
        this.setState({page});
    }

    renderHome() {
        return <NotesPage/>
    }

    renderSettings() {
        return <SettingsPage/>
    }

    render() {
        var page;
        switch (this.state.page) {
            case 'settings':
                page = this.renderSettings();
                break;
            default:
                page = this.renderHome();
                break;
        }
        return <div>
                   <Header
                       page={this.state.page}
                       books={this.props.books}
                       onPageChange={this.handlePageChange.bind(this)}
                   />
                   {page}
               </div>
    }
}

export default branch(Main, {
    cursors: {books: ['books']}
});
