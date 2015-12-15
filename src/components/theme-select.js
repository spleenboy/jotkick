import React, {PropTypes, Component} from 'react';

import DropDownMenu from 'material-ui/lib/drop-down-menu';

import Themes from '../themes/';

export default class ThemeSelect extends Component {
    static get propTypes() {
        return {
            theme: PropTypes.string,
            onThemeChange: PropTypes.func.isRequired,
        }
    }

    handleThemeChange(e, index, item) {
        this.props.onThemeChange(item);
    }

    render() {
        const themeList = [];
        const themeKeys = Object.keys(Themes);
        let themeIndex  = 0;
        themeKeys.forEach((key, i) => {
            themeList.push({
                text: Themes[key].name,
                payload: key,
            });
            if (key === this.props.theme) {
                themeIndex = i;
            }
        });

        return <DropDownMenu
                   menuItems={themeList}
                   onChange={this.handleThemeChange.bind(this)}
                   selectedIndex={themeIndex}
               />
    }
}
