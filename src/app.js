import ReactDOM from 'react-dom';
import {root} from 'baobab-react/higher-order';
import tree from './state/';
import Main from './components/main';

const RootedApp = root(Main, tree);

ReactDOM.render(<RootedApp/>, document.getElementById('app'));
