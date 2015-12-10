import Baobab from 'baobab';
import * as Model from './model';
import {init} from './actions/tree';

const tree = new Baobab();
tree.set(Model.Tree());
tree.commit();
init(tree);

export default tree;
