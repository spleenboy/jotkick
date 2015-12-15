import React, {PropTypes, Component} from 'react';
import {branch} from 'baobab-react/higher-order';

import ThemeManager from 'material-ui/lib/styles/theme-manager';
import Themes from '../themes/';

import NotesPage from './notes-page';
import SettingsPage from './settings-page';

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

        return <div className="row center-xs" style={{backgroundColor: theme.palette.canvasColor}}>
                   <div className="col-xs-12 col-sm-10 col-md-8">
                       <div className="box" style={pageStyle}>
                           {page}
                       </div>
                   </div>
               </div>
    }
}

export default branch(Main, {
    cursors: {
        books: ['books'],
        theme: ['settings', 'theme'],
    }
});
