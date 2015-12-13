import React, {Component, PropTypes} from 'react';
import Catdown from 'catdown';
import marked from 'marked';

import '../themes/editor/default.css';

export default class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editor: null,
            content: '',
        };
    }

    static get propTypes() {
        return {
            active: PropTypes.bool,
            value: PropTypes.string,
            onChange: PropTypes.func.isRequired,
        };
    }


    handleTextFocus() {
        this.props.onFocus && this.props.onFocus(this);
        this.state.editor.focus();
    }


    handleTextChange() {
        let value = this.state.editor.value();
        this.props.onChange(value);
        this.setState({content: value});
    }


    componentDidMount() {
        let editor = new Catdown({
            textarea: this.refs.editor,
            viewportMargin: Infinity,
            height: 'auto',
        });
        if (this.props.value) {
            editor.set(this.props.value);
        }
        editor.on('change', this.handleTextChange.bind(this));
        this.setState({
            editor,
            content: this.props.value,
        });
    }


    componentWillUnmount() {
        this.setState({editor: null});
    }


    componentWillReceiveProps(next) {
        if (next.value !== this.state.content) {
            this.setState({content: next.value});
        }
    }


    render() {
        const containerStyle = {
            margin: 10,
        };

        const editStyle = {
            width      : '100%',
            visibility : this.props.active ? 'visible' : 'hidden',
            position   : this.props.active ? 'static'  : 'absolute',
        };

        let viewing;
        if (!this.props.active) {
            const markup = () => {
                return {__html: marked(this.state.content)};
            }
            viewing = <div ref="viewing" style={{width: '100%'}}>
                          <div dangerouslySetInnerHTML={markup()}/>
                      </div>
        } else {
            viewing = null;
        }

        return <div style={containerStyle} onTouchTap={this.handleTextFocus.bind(this)}>
                   <div ref="editing" style={editStyle}>
                       <textarea ref="editor" />
                   </div>
                   {viewing}
               </div>
    }
};
