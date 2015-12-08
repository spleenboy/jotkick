import React, {Component, PropTypes} from 'react';
import Catdown from 'catdown';

import '../themes/editor/default.css';
import Paper from 'material-ui/lib/paper';

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
        this.setState({editor});
    }

    componentWillUnmount() {
        this.setState({editor: null});
    }

    render() {
        const containerStyle = {
            flex: 1,
            margin: 10,
        };
        const editorDisplay = this.props.active ? 'block' : 'none';
        const previewDisplay = this.props.active ? 'none' : 'block';
        return <Paper zDepth={2} style={containerStyle}>
                    <textarea
                        ref="editor"
                        style={{display: editorDisplay}}
                    />
                    <div
                        ref="preview"
                        style={{display: previewDisplay}}
                    />
               </Paper>
    }
};

Editor.propTypes = {
    active: PropTypes.bool,
    initialValue: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};
