import React, {Component, PropTypes} from 'react';
import marked from 'marked';

export default class Editor extends Component {
    propTypes: {
        value: PropTypes.string,
        onChange: PropTypes.func.isRequired,
    }

    handleTextChange(e) {
       this.props.onChange(e.target.value);
    }

    render() {
        var __html = marked(this.props.value);
        return <div className="editor">
                    <textarea value={this.props.value} onChange={this.handleTextChange}/>
                    <div dangerouslySetInnerHTML={{__html}}
               </div>
    }
};
