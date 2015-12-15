import React, {Component, PropTypes} from 'react';
import marked from 'marked';
import TextField from 'material-ui/lib/text-field';

export default class Editor extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            value: this.props.value,
            theme: this.context.muiTheme,
        };
    }


    static get contextTypes() {
        return {
            muiTheme: PropTypes.object,
        }
    }


    handleTextFocus() {
        this.props.onFocus && this.props.onFocus(this);
    }


    handleTextChange(e) {
        this.props.onChange(e.target.value);
        this.setState({value: e.target.value});
    }


    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.value !== this.state.value) {
            this.setState({value: nextProps.value});
        }
        this.setState({theme: nextContext.muiTheme});
    }


    render() {
        const containerStyle = {
            margin: 10,
        };

        const textColor = this.state.theme.rawTheme.palette.textColor;
        let contents;
        if (this.props.active) {
            const lines = this.state.value.split('\n');
            contents = <TextField
                           fullWidth={true}
                           multiLine={true}
                           rows={lines.length}
                           value={this.state.value}
                           onChange={this.handleTextChange.bind(this)}
                       />
        } else {
            const markup = () => {
                let __html = marked(this.state.value);
                // Default to an empty line
                if (__html.length === 0) {
                    __html = '<br>';
                }
                return {__html}
            };
            contents = <div style={{color: textColor}} dangerouslySetInnerHTML={markup()} />
        }

        return <div ref="editor" style={containerStyle} onTouchTap={this.handleTextFocus.bind(this)}>
                   {contents}
               </div>
    }
};

Editor.propTypes = {
    active: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};
