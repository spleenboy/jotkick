import React, {Component, PropTypes} from 'react';
import Catdown from 'catdown';

import '../themes/editor/default.css';

export default class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editor: null,
        };
    }

    handleTextChange() {
       let value = this.state.editor.value();
       this.props.onChange(value);
    }

    componentDidMount() {
        let editor = new Catdown({
            textarea: this.refs.editor,
            preview: this.refs.preview,
            viewportMargin: Infinity,
            height: 'auto',
        });
        if (this.props.initialValue) {
            editor.set(this.props.initialValue);
        }
        editor.on('change', this.handleTextChange.bind(this));
        this.toggleEditor();
        this.setState({editor});
    }

    toggleEditor() {
        if (!this.state.editor) {
            return;
        }
        this.state.editor.$editor.style.display = this.props.active ? 'block' : 'none';
    }

    componentWillUnmount() {
        this.setState({editor: null});
    }

    render() {
        const containerStyle = {
            flex: 1,
            margin: 10,
        };
        this.toggleEditor();
        return <div style={containerStyle}>
                   <textarea ref="editor" style={{display: 'none'}} />
                   <div
                       ref="preview"
                       style={{display: this.props.active ? 'none' : 'block'}}
                   />
               </div>
    }
};

Editor.propTypes = {
    active: PropTypes.bool,
    initialValue: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};
