require('font-awesome/css/font-awesome.css');
require('flexboxgrid/css/flexboxgrid.min.css');

import ReactDOM from 'react-dom';
import {root} from 'baobab-react/higher-order';
import Tree from './state/';
import Main from './components/main';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const tree = new Tree();
tree.load();

const RootedApp = root(Main, tree);

ReactDOM.render(<RootedApp/>, document.getElementById('app'));
