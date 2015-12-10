import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';

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

    render() {
        const ready = !!this.props.baseUrl;
        var page;
        if (!ready || this.state.page === 'settings') {
            return <SettingsPage onPageChange={this.handlePageChange.bind(this)}/>
        }

        return <NotesPage onPageChange={this.handlePageChange.bind(this)}/>
    }
}

export default branch(Main, {
    cursors: {
        baseUrl: ['settings', 'baseUrl'],
    }
});
