import React, {Component, PropTypes} from 'react';
import marked from 'marked';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
import TextField from 'material-ui/lib/text-field';

const TAB_TO_SPACES = 4;

export default class TextEditor extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selection: null,
        };
    }


    static renderHtml(text, renderer = null) {
        renderer = renderer || new marked.Renderer();
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


    handleTextFocus(e) {
        if (this.refs.markup) {
            // Calculate where the click occured and move the selection.
            const target = e.target;
            const text = target.innerText;
            const index = this.props.value.indexOf(target.innerText);
            if (index >= 0) {
                this.setState({
                    selection: {
                        start: index,
                        end: index + target.innerText.length,
                    }
                });
            }
        }
        this.props.onFocus && this.props.onFocus(this);
    }


    handleKeyDown(e) {
        if (e.keyCode === 9) {
            e.preventDefault();
            const input = e.currentTarget;
            const value = this.refs.textarea.getValue();
            const start = value.substring(0, input.selectionStart);
            const end   = value.substring(input.selectionEnd);
            const space = ' '.repeat(TAB_TO_SPACES);
            input.value = `${start}${space}${end}`;
            this.props.onChange && this.props.onChange(input.value);
            this.setState({
                selection: {
                    start: start.length + space.length,
                    end: start.length + space.length,
               }
            });
        }
    }


    handleKeyUp(e) {
        if (this.state.selection) {
            this.setState({selection: null});
        }
    }


    handleTextChange(e) {
        this.props.onChange && this.props.onChange(e.currentTarget.value);
    }


    componentDidMount() {
        if (this.props.active) {
            this.refs.textarea.focus();
        }
    }


    componentDidUpdate(prevProps, prevState) {
        if (!this.props.active) {
            return;
        }

        const textarea = this.refs.textarea._getInputNode();

        if (this.state.selection) {
            const selection = this.state.selection;

            // Set the selection
            textarea.setSelectionRange(selection.start, selection.end);

            // Scroll to it
            const row = (selection.start - (selection.start % textarea.cols)) / textarea.cols;
            const rowHeight = textarea.clientHeight / textarea.rows;

            const offset = textarea.getBoundingClientRect().top;
            window.scrollTo(0, offset + (rowHeight * row));

        } else if (!prevProps.active) {

            textarea.focus();
            textarea.scrollIntoView({behavior: 'smooth'});

        }
    }


    render() {
        const containerStyle = {
            padding: '20px 40px',
        };

        const theme = this.props.theme;
        const renderer = new theme.renderer(theme);

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
                           ref="textarea"
                           fullWidth={true}
                           multiLine={true}
                           rows={lines.length}
                           inputStyle={style}
                           value={this.props.value}
                           onKeyDown={this.handleKeyDown.bind(this)}
                           onKeyUp={this.handleKeyUp.bind(this)}
                           onChange={this.handleTextChange.bind(this)}
                       />
        } else {
            let style = {
                color: theme.palette.textColor,
                cursor: 'text',
            };

            const markup = () => {
                let __html = this.constructor.renderHtml(this.props.value, renderer);
                // Default to an empty line
                if (__html.length === 0) {
                    __html = '<br>';
                }
                return {__html}
            };
            contents = <div
                           ref="markup"
                           style={style}
                           dangerouslySetInnerHTML={markup()}
                       />
        }

        return <div ref="editor" style={containerStyle} onTouchTap={this.handleTextFocus.bind(this)}>
                   {contents}
               </div>
    }
};
