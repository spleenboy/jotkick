import React, {PropTypes, Component} from 'react';

import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';

export default class Header extends Component {
    handlePageChange(page) {
        this.props.onPageChange(page);
    }

    render() {
        const settings = <IconButton
                            iconClassName="fa fa-cogs"
                            tooltip="Settings"
                            onTouchTap={this.handlePageChange.bind(this, "settings")}
                         />
        return <div className="row">
                   <div className="col-xs-12">
                       <div className="box">
                           <AppBar
                               title="JotKick"
                               iconElementRight={settings}
                               showMenuIconButton={false}
                               onTitleTouchTap={this.handlePageChange.bind(this, "home")}
                           />
                       </div>
                   </div>
               </div>
    }
}

Header.propTypes = {
    onPageChange: PropTypes.func.isRequired,
}
