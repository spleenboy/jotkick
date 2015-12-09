import React, {PropTypes, Component} from 'react';

import Header from './header';
import NotesPage from './notes-page';
import SettingsPage from './settings-page';

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renderer: this.renderHome.bind(this)
        };
    }

    handlePageChange(page) {
        var renderer;
        switch (page) {
            case 'settings':
                renderer = this.renderSettings.bind(this);
                break;
            default:
                renderer = this.renderHome.bind(this);
                break;
        }
        this.setState({renderer});
    }

    renderHome() {
        return <NotesPage/>
    }

    renderSettings() {
        return <SettingsPage/>
    }

    render() {
        return <div>
                   <Header onPageChange={this.handlePageChange.bind(this)} />
                   {this.state.renderer()}
               </div>
    }
}
