import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';

import ThemeManager from 'material-ui/lib/styles/theme-manager';
import Colors from 'material-ui/lib/styles/colors';
import Snackbar from 'material-ui/lib/snackbar';

import Themes from '../themes/';
import * as session from '../state/actions/session';

import NotesPage from './notes-page';
import SettingsPage from './settings-page';
import QuitButton from './quit-button';

class Main extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            page: 'home',
        };
    }

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

    handlePageChange(page) {
        this.setState({page});
    }

    handleDismiss(key, index) {
        this.props.actions.removeFromSession(key, index);
    }

    render() {
        const pageStyle = {
            minWidth: 600,
            textAlign: 'left'
        };
        const ready = this.props.books.find(b => b.active);
        const theme = Themes[this.props.theme] || Themes.Light;
        let page;

        if (!ready || this.state.page === 'settings') {
            page = <SettingsPage onPageChange={this.handlePageChange.bind(this)}/>
        } else {
            page = <NotesPage onPageChange={this.handlePageChange.bind(this)}/>
        }

        const errors = this.props.errors.map((err, i) => {
            return <Snackbar
                       key={i}
                       message={`Error! ${err.message}`}
                       openOnMount={true}
                       action="Dismiss"
                       style={{backgroundColor: Colors.red, color: Colors.white}}
                       onActionTouchTap={this.handleDismiss.bind(this, 'errors', i)}
                   />
        });

        const alerts = this.props.alerts.map((msg, i) => {
            return <Snackbar
                       key={i}
                       message={msg}
                       openOnMount={true}
                       action="Dismiss"
                       autoHideDuration={5000}
                       onActionTouchTap={this.handleDismiss.bind(this, 'alerts', i)}
                   />
        });

        return <div className="row center-xs" style={{backgroundColor: theme.palette.canvasColor}}>
                   <div className="col-xs-12 col-sm-12 col-md-8">
                       <div className="box" style={pageStyle}>
                           {page}
                           {errors}
                           {alerts}
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
        errors: ['session', 'errors'],
        alerts: ['session', 'alerts'],
    },
    actions: {
        removeFromSession: session.remove,
    }
});
