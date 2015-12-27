import React, {Component, PropTypes} from 'react';
import marked from 'marked';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
import TextField from 'material-ui/lib/text-field';

const TAB_TO_SPACES = 4;

export default class Editor extends Component {

    static renderHtml(text, theme = null) {
        const renderer = (theme && theme.renderer) || new marked.Renderer();
        const markedOpts = {
            gfm: true,
            breaks: true,
            tables: true,
            smartypants: true,
            renderer: renderer,
        };
        return marked(text, markedOpts);
    }

    
    static get propTypes() {
        return {
            active: PropTypes.bool,
            value: PropTypes.string,
            theme: PropTypes.object.isRequired,
            onFocus: PropTypes.func,
            onChange: PropTypes.func,
        }
    }


    handleTextFocus() {
        this.props.onFocus && this.props.onFocus(this);
    }


    handleKeyDown(e) {
        if (e.keyCode === 9) {
            e.preventDefault();
            const input = e.currentTarget;
            const start = input.value.substring(0, input.selectionStart);
            const end   = input.value.substring(input.selectionEnd);
            const space = ' '.repeat(TAB_TO_SPACES);
            input.value = `${start}${space}${end}`;
        }
    }


    handleTextChange(e) {
        this.props.onChange && this.props.onChange(e.target.value);
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

        const theme = this.props.theme;
        let contents;
        if (this.props.active) {
            containerStyle.backgroundColor = ColorManipulator.lighten(theme.palette.canvasColor, 50);
            let style = {
                fontFamily: theme.monoFontFamily,
                fontSize: '120%',
                lineHeight: '180%',
            };
            const lines = this.props.value.split('\n');
            contents = <TextField
                           ref="content"
                           fullWidth={true}
                           multiLine={true}
                           rows={lines.length}
                           inputStyle={style}
                           value={this.props.value}
                           onKeyDown={this.handleKeyDown.bind(this)}
                           onChange={this.handleTextChange.bind(this)}
                       />
        } else {
            let style = {
                color: theme.palette.textColor,
                cursor: 'text',
            };

            const markup = () => {
                let __html = this.constructor.renderHtml(this.props.value, theme);
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
