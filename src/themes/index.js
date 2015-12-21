require('./fonts/stylesheet.css');

import Light from './light';
import Dark from './dark';

[Light, Dark].forEach((theme) => {
    theme.monoFontFamily = 'luxi, Courier New, Courier, monospace';
    theme.alternateFontFamily = 'specialelite, bitter, Palatino, serif';
    theme.fontFamily = 'bitter, Palatino, serif';
});

export default {Light, Dark}
