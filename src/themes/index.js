require('./fonts/stylesheet.css');
import MarkdownRenderer from './markdown-renderer';

import Light from './light';
import Dark from './dark';
import Sunset from './sunset';

const Themes = {Light, Dark, Sunset};

function addFonts(theme) {
    theme.monoFontFamily = 'luxi, Courier New, Courier, monospace';
    theme.alternateFontFamily = 'specialelite, bitter, Palatino, serif';
    theme.fontFamily = 'bitter, Palatino, serif';
}


Object.keys(Themes).forEach((key) => {
    let theme = Themes[key];
    addFonts(theme);
    theme.renderer = new MarkdownRenderer(theme);
});

export default Themes;
