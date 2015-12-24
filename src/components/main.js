import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';

import ThemeManager from 'material-ui/lib/styles/theme-manager';
import Snackbar from 'material-ui/lib/snackbar';

import Themes from '../themes/';
import * as session from '../state/actions/session';

import NotesPage from './notes-page';
import SettingsPage from './settings-page';
import QuitButton from './quit-button';
import Messaging from './messaging';

class Main extends Component {
    static get childContextTypes() {
        return {
            muiTheme: PropTypes.object,
        };
    }

    getChildContext() {
        const theme = Themes[this.props.theme] || Themes.Light;
        return {
            muiTheme: ThemeManager.getMuiTheme(theme),
        }
    }

    render() {
        const pageStyle = {
            minWidth: 600,
            textAlign: 'left'
        };
        const ready = this.props.books.find(b => b.active);
        const theme = Themes[this.props.theme] || Themes.Light;
        let page;

        if (!ready || this.props.page === 'settings') {
            page = <SettingsPage/>
        } else {
            page = <NotesPage/>
        }

        return <div className="row center-xs" style={{backgroundColor: theme.palette.canvasColor}}>
                   <div className="col-xs-12 col-sm-12 col-md-8">
                       <div className="box" style={pageStyle}>
                           {page}
                           <Messaging />
                           <QuitButton/>
                       </div>
                   </div>
               </div>
    }
}

export default branch(Main, {
    cursors: {
        books: ['books'],
        theme: ['settings', 'theme'],
        page: ['sesssion', 'page'],
    }
});
