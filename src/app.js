import ReactDOM from 'react-dom';
import {root} from 'baobab-react/higher-order';
import tree from './state/';
import Main from './components/main';
require('font-awesome/css/font-awesome.css');
require('flexboxgrid/css/flexboxgrid.min.css');

const RootedApp = root(Main, tree);

ReactDOM.render(<RootedApp/>, document.getElementById('app'));
