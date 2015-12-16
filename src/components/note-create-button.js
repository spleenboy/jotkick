import React, {PropTypes, Component} from 'react';

import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';

export default class NoteCreateButton extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            theme: this.context.muiTheme,
        }
    }


    static get contextTypes() {
        return {
            muiTheme: PropTypes.object,
        }
    }


    static get propTypes() {
        return {
            book: PropTypes.object.isRequired,
            onCreate: PropTypes.func.isRequired,
        }
    }


    handleCreateNote(e) {
        this.props.onCreate();
    }

    render() {
        const label = this.props.book.notes.length
                      ? "Create a New Note"
                      : "Create Your First Note";
        const textColor = this.state.theme.rawTheme.palette.textColor;
        return <RaisedButton
                   fullWidth={true}
                   primary={true}
                   style={{textAlign: 'center', height: 200}}
                   onTouchTap={this.handleCreateNote.bind(this)}
               >
                   <span style={{color: textColor, fontSize: '2em'}}>
                       <FontIcon className="fa fa-comment fa-flip-horizontal"/> {label} <FontIcon className="fa fa-comment"/>
                   </span>
               </RaisedButton>
    }
}
