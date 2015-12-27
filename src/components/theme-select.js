import React, {PropTypes, Component} from 'react';

import DropDownMenu from 'material-ui/lib/drop-down-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';

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
        const themeKeys = Object.keys(Themes);
        const themeList = themeKeys.map((key, i) => {
            return <MenuItem
                       primaryText={Themes[key].name}
                       value={key}
                       key={i}
                   />
        });

        return <DropDownMenu
                   onChange={this.handleThemeChange.bind(this)}
                   value={this.props.theme}
               >{themeList}</DropDownMenu>
    }
}
