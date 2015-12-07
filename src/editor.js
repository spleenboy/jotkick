import React, {Component, PropTypes} from 'react';
import marked from 'marked';

export default class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.defaultValue || ""
        };
    }

    handleTextChange(e) {
       let value = e.target.value;
       this.setState({value});
       this.props.onChange(value);
    }

    render() {
        var __html = marked(this.state.value);
        return <div className="editor">
                    <textarea
                        style={{width: '100%', minHeight: '50%'}}
                        value={this.state.value}
                        onChange={this.handleTextChange.bind(this)}
                    />
                    <div
                        style={{width: '100%', minHeight: '50%'}}
                        dangerouslySetInnerHTML={{__html}}
                    />
               </div>
    }
};

Editor.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};
