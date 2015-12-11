import React, {PropTypes, Component} from 'react';

export class Row extends Component {
    render() {
        return <div className="row">
                   <div className="col-xs-12">
                       <div className="box">
                           {this.props.children}
                       </div>
                   </div>
               </div>
    }
};
