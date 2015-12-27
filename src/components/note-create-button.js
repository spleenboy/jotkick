import React, {PropTypes, Component} from 'react';

import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';

export default class NoteCreateButton extends Component {
    static get propTypes() {
        return {
            onCreate: PropTypes.func.isRequired,
        }
    }

    handleCreateNote(e) {
        this.props.onCreate();
    }

    render() {
        return <RaisedButton
                   fullWidth={true}
                   primary={true}
                   onTouchTap={this.handleCreateNote.bind(this)}
                   label="Create a New Note"
                   labelStyle={{fontSize: '1.5em'}}
               >
                   <FontIcon className="fa fa-plus-square"/>
               </RaisedButton>
    }
}
