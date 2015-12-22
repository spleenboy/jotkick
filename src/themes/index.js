require('flexboxgrid/css/flexboxgrid.min.css');
require('font-awesome/css/font-awesome.css');
require('./fonts/stylesheet.css');

import MarkdownRenderer from './markdown-renderer';

import Light from './light';
import Dark from './dark';
import Sunset from './sunset';

const Themes = {Light, Dark, Sunset};

function addFonts(theme) {
    theme.monoFontFamily = 'luxi';
    theme.alternateFontFamily = 'JustOldFashion, bitter';
    theme.fontFamily = 'bitter';
}


Object.keys(Themes).forEach((key) => {
    let theme = Themes[key];
    addFonts(theme);
    theme.renderer = new MarkdownRenderer(theme);
});

export default Themes;
