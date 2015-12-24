import React, {PropTypes, Component} from 'react';

import TextField from 'material-ui/lib/text-field';
import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';

export default class SearchBar extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            searching: false,
        };
    }


    static get propTypes() {
        return {
            active: PropTypes.bool,
            onChange: PropTypes.func,
            onSearch: PropTypes.func,
            onCancel: PropTypes.func,
        };
    }


    handleSearchStart() {
        this.setState({searching: true});
    }


    handleSearch(e) {
        const field = this.refs.searchField;
        const value = field.getValue();
        if (!value.length) {
            this.refs.search.setErrorText("Searching for nothing? How existential.");
        } else {
            this.refs.search.setErrorText("");
            this.props.onSearch && this.props.onSearch(value);
        }
    }


    handleChange(e) {
        const value = this.refs.searchField.getValue();
        this.props.onChange && this.props.onChange(value);
    }


    handleCancel(e) {
        this.cancel();
    }


    cancel() {
        if (this.state.searching) {
            this.refs.searchField.setErrorText("");
            this.refs.searchField.clearValue();
            this.setState({searching: false});
        }
        this.props.onCancel();
    }


    componentDidUpdate(prevProps, prevState) {
        if (this.state.searching && !prevState.searching) {
            this.refs.searchField.focus();
        }
    }


    render() {
        const style = this.props.style || {};
        const tooltip = this.props.tooltip || "Search";

        if (!this.state.searching) {
            return <IconButton
                       ref="searchButton"
                       touch={true}
                       tooltip={tooltip}
                       tooltipPosition="top-center"
                       onTouchTap={this.handleSearchStart.bind(this)}
                   >
                       <FontIcon className="fa fa-search"/>
                   </IconButton>
        }
        return <span>
                    <TextField
                        ref="searchField"
                        hintText="Enter search terms"
                        onChange={this.handleChange.bind(this)}
                        onKeyEnterDown={this.handleSearch.bind(this)}
                    />
                    <IconButton
                        onTouchTap={this.handleCancel.bind(this)}
                    >
                        <FontIcon className="fa fa-times"/>
                    </IconButton>
               </span>
    }
}
