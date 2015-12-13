import Baobab from 'baobab';
import * as Model from './model';
import {init} from './actions/tree';

const tree = new Baobab(Model.Tree(), {
    asynchronous: false,
    immutable: false,
});
tree.commit();
init(tree);

export default tree;
