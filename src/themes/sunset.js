import Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
import Spacing from 'material-ui/lib/styles/spacing';
import zIndex from 'material-ui/lib/styles/zIndex';

const Theme = {
    name: "Sunset",
    spacing: Spacing,
    zIndex: zIndex,
    palette: {
        primary1Color: Colors.teal500,
        primary2Color: Colors.teal700,
        primary3Color: Colors.brown900,
        accent1Color: Colors.deepOrange900,
        accent2Color: Colors.orange900,
        accent3Color: Colors.yellow900,
        textColor: Colors.orange100,
        alternateTextColor: Colors.amber900,
        canvasColor: Colors.blueGrey800,
        borderColor: Colors.blueGrey400,
        disabledColor: ColorManipulator.fade(Colors.orange900, 0.3),
        pickerHeaderColor: Colors.blueGrey500,
        clockCircleColor: ColorManipulator.fade(Colors.blueGrey800, 0.07),
    },
};

export default Theme;
