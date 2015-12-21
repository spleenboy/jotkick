import React, {PropTypes, Component} from 'react';

export default class Heading extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            theme: this.context.muiTheme,
        };
    }


    static get contextTypes() {
        return {
            muiTheme: PropTypes.object,
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({theme: nextContext.muiTheme});
    }

    render() {
        const theme = this.state.theme.rawTheme;
        const style = {
            color: theme.palette.textColor,
            fontFamily: theme.alternateFontFamily,
            textAlign: 'center',
        };

        return <h1 style={style}>{this.props.children}</h1>
    }
};
