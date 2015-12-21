import {Renderer} from 'marked';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';

// The renderer is used by the markdown display to format elements
export default class MarkdownRenderer extends Renderer {
    constructor(theme) {
        super();
        this.theme = theme;
    }

    heading(text, level) {
        const theme = this.theme;
        let textColor;
        if (level <= 1) {
            textColor = theme.palette.accent1Color;
        } else if (level <= 2) {
            textColor = theme.palette.accent2Color;
        } else if (level <= 4) {
            textColor = theme.palette.accent3Color;
        } else if (level <= 5) {
            textColor = theme.palette.textColor;
        } else {
            textColor = theme.palette.disabledColor;
        }

        return `<h${level} style="color: ${textColor}">${text}</h1>`;
    }

    code(text, lang) {
        const theme = this.theme;
        const bgColor = ColorManipulator.fade(theme.palette.accent1Color, 0.2);
        const fgColor = theme.palette.disabledColor;
        return `<code style="background-color: ${bgColor}; color: ${fgColor}">${text}</code>`;
    }

    link(href, title, text) {
        const el = super.link(href, title, text);
        const fgColor = this.theme.palette.primary1Color;
        return `<span style="color: ${fgColor}">${el}</span>`;
    }
}
