import React, {Component, PropTypes} from 'react';
import marked from 'marked';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
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

    
    static get propTypes() {
        return {
            active: PropTypes.bool,
            value: PropTypes.string,
            onFocus: PropTypes.func,
            onChange: PropTypes.func,
        }
    }


    handleTextFocus() {
        this.props.onFocus && this.props.onFocus(this);
    }


    handleTextChange(e) {
        this.props.onChange && this.props.onChange(e.target.value);
        this.setState({value: e.target.value});
    }


    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.value !== this.state.value) {
            this.setState({value: nextProps.value});
        }
        this.setState({theme: nextContext.muiTheme});
    }


    componentDidMount() {
        if (this.props.active) {
            this.refs.content.focus();
        }
    }


    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.active && this.props.active) {
            this.refs.content.focus();
        }
    }


    render() {
        const containerStyle = {
            padding: '20px 40px',
        };

        const theme = this.state.theme.rawTheme;
        let contents;
        if (this.props.active) {
            containerStyle.backgroundColor = ColorManipulator.lighten(theme.palette.canvasColor, 50);
            let style = {
                fontFamily: theme.monoFontFamily,
                fontSize: '120%',
                lineHeight: '180%',
            };
            const lines = this.state.value.split('\n');
            contents = <TextField
                           ref="content"
                           fullWidth={true}
                           multiLine={true}
                           rows={lines.length}
                           value={this.state.value}
                           inputStyle={style}
                           onChange={this.handleTextChange.bind(this)}
                       />
        } else {
            let style = {
                color: theme.palette.textColor,
                cursor: 'text',
            };
            const renderer = theme.renderer || new marked.Renderer();
            const markedOpts = {
                gfm: true,
                breaks: true,
                tables: true,
                smartypants: true,
                renderer: renderer,
            };
            const markup = () => {
                let __html = marked(this.state.value, markedOpts);
                // Default to an empty line
                if (__html.length === 0) {
                    __html = '<br>';
                }
                return {__html}
            };
            contents = <div
                           ref="content"
                           style={style}
                           dangerouslySetInnerHTML={markup()}
                       />
        }

        return <div ref="editor" style={containerStyle} onTouchTap={this.handleTextFocus.bind(this)}>
                   {contents}
               </div>
    }
};
