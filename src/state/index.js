import Baobab from 'baobab';
import * as Model from './model';
import * as settings from '../actions/settings';

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
        settings.load(this, callback);
    }
}
