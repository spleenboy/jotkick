import {Renderer} from 'marked';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';

// The renderer is used by the markdown display to format elements
export default class MarkdownRenderer extends Renderer {
    constructor(theme) {
        super();
        this.theme = theme;
        this.withTokens = false;
    }

    blockquote(text) {
        if (this.withTokens) {
            text = text.replace(/<p>/ig, '<p>&gt; ');
        }
        return super.blockquote(text);
    }

    code(text, lang) {
        if (this.withTokens) text = "```<br/>" + text + "<br/>```";
        const theme = this.theme;
        const bgColor = ColorManipulator.fade(theme.palette.accent1Color, 0.2);
        const fgColor = theme.palette.disabledColor;
        const font = theme.monoFontFamily;
        return `<div style="background-color: ${bgColor}; font-family: ${font}; color: ${fgColor}; white-space: pre-wrap; margin-left: 2em;">${text}</div>`;
    }

    codespan(text) {
        const fgColor = this.theme.palette.disabledColor;
        const font = this.theme.monoFontFamily;
        if (this.withTokens) text = "`" + text + "`";
        return `<span style="color: ${fgColor}; font-family: ${font};">${text}</span>`;
    }

    del(text) {
        if (this.withTokens) text = `~~${text}~~`;
        return super.del(text);
    }

    em(text) {
        if (this.withTokens) text = `*${text}*`;
        return super.em(text);
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

        const prefix = this.withTokens ? '#'.repeat(level) + ' ' : '';

        return `<h${level} style="color: ${textColor}">${prefix}${text}</h1>`;
    }

    hr() {
        return super.hr();
    }

    html(text) {
        return super.html(text);
    }

    image(href, title, text) {
        return super.image(href, title, text);
    }

    link(href, title, text) {
        let el = super.link(href, title, text);
        const fgColor = this.theme.palette.primary1Color;
        if (this.withTokens) el = `[${el}](${href})`;
        return `<span style="color: ${fgColor}">${el}</span>`;
    }

    list(body, ordered) {
        return super.list(body, ordered);
    }

    listitem(text) {
        return super.listitem(text);
    }

    paragraph(text) {
        return super.paragraph(text);
    }

    strong(text) {
        if (this.withTokens) text = `**${text}**`;
        return super.strong(text);
    }

    table(header, body) {
        return super.table(header, body);
    }

    tablerow(text) {
        return super.tablerow(text);
    }

    tablecell(text, flags) {
        return super.tablecell(text, flags);
    }
}
