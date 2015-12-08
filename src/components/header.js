import React, {PropTypes, Component} from 'react';

import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';

export default class Header extends Component {
    render() {
        return <div className="row">
                   <div className="col-xs-12">
                       <div className="box">
                           <AppBar
                               title="JotKick"
                               iconElementRight={<IconButton iconClassName="fa fa-cogs" tooltip="Settings"/>}
                           />
                       </div>
                   </div>
               </div>
    }
}
