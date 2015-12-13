import Baobab from 'baobab';
import * as Model from './model';
import {load as loadTree} from './actions/tree';

export default class Tree extends Baobab {
    constructor(data = null, opts = null) {
        data = data || Model.Tree();
        opts = opts || {
            asynchronous: false,
            immutable: false,
        };
        super(data, opts);
    }

    load(callback = null) {
        loadTree(this, callback);
    }
}
