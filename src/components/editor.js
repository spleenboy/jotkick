import React, {Component, PropTypes} from 'react';
import Catdown from 'catdown';
import marked from 'marked';

import '../themes/editor/default.css';

export default class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editor: null,
        };
    }


    handleTextFocus() {
        this.props.onFocus && this.props.onFocus(this);
    }


    handleTextChange() {
       let value = this.state.editor.value();
       this.props.onChange(value);
    }


    componentDidMount() {
        let editor = new Catdown({
            textarea: this.refs.editor,
            viewportMargin: Infinity,
            height: 'auto',
        });
        if (this.props.initialValue) {
            editor.set(this.props.initialValue);
        }
        editor.on('change', this.handleTextChange.bind(this));
        this.setState({editor});
    }


    componentWillUnmount() {
        this.setState({editor: null});
    }

    componentWillReceiveProps(nextProps) {
        // Handle a wholesale switch of the content of this editor
        if (nextProps.initialValue !== this.state.editor.value()) {
            this.state.editor.set(nextProps.initialValue);
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
                return {__html: marked(this.props.initialValue)};
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

Editor.propTypes = {
    active: PropTypes.bool,
    initialValue: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};
