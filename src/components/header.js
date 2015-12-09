import React, {PropTypes, Component} from 'react';

import AppBar from 'material-ui/lib/app-bar';
import IconMenu from 'material-ui/lib/icon-menu';
import IconButton from 'material-ui/lib/icon-button';

export default class Header extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            navIndex: -1,
            navOpen: false,
        };
    }

    handlePageChange(page) {
        this.props.onPageChange(page);
    }

    handleNavToggle() {
        this.setState({navOpen: !this.state.navOpen});
    }

    handleNavChange(e, index, item) {
        this.setState({
            navOpen: false,
            navIndex: index,
        });
    }

    render() {
        const settings = <IconButton
                            iconClassName="fa fa-cogs"
                            tooltip="Settings"
                            onTouchTap={this.handlePageChange.bind(this, "settings")}
                         />

        let menuItems = [
            {text: <IconButton className="fa fa-times" style={{float: 'right'}} />},
            {text: "Books", type: MenuItem.Types.SUBHEADER}
        ];
        this.props.books.forEach((b, i) => {
            menuItems.push({
                text: b.title,
                route: 'book/' + b.id
            });
        });

        const menuLeft = <IconMenu
                             iconButtonElement={<IconButton iconClassName="fa fa-menu">}
                             menuItems={menuItems}
                             onChange={this.handleNavChange.bind(this)}
                         />
        return <div className="row">
                   <div className="col-xs-12">
                       <div className="box">
                           <AppBar
                               title="JotKick"
                               iconElementRight={settings}
                               iconElementLeft={menuLeft}
                               onTitleTouchTap={this.handlePageChange.bind(this, "home")}
                               onLeftIconButtonTouchTap={this.handleNavToggle.bind(this)}
                           />
                       </div>
                   </div>
               </div>
    }
}

Header.propTypes = {
    books: PropTypes.array.isRequired,
    page: PropTypes.string.isRequired,
    onPageChange: PropTypes.func.isRequired,
}
