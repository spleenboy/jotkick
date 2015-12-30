import uuid from 'uuid';
import * as Model from '../model';

export function query(tree, value) {
    tree.set(['session', 'query'], value);
};

export function setPage(tree, value) {
    tree.set(['session', 'page'], value);
};

export function addMessage(tree, message) {
    tree.push(['session', 'messages'], message);
};


export function removeMessage(tree, id) {
    const msgs = tree.select('session', 'messages');
    const index = msgs.get().findIndex(m => m.id === id);
    if (index >=0) {
        msgs.splice([index, 1]);
    }
}

export function error(tree, err, text = '') {
    const msg = Model.Message(text);
    msg.type = Model.Message.Error;
    msg.err = err;
    addMessage(tree, msg);
};

export function alert(tree, text) {
    const msg = Model.Message(text);
    msg.type = Model.Message.Alert;
    addMessage(tree, msg);
};

export function action(tree, text, callback, action = "Undo") {
    const msg = Model.Message(text);

    let outerCallback = () => {
        callback && callback();
        removeMessage(tree, msg.id);
    };

    msg.callback = outerCallback;
    msg.action = action;
    msg.type = Model.Message.Action;

    addMessage(tree, msg);
};

export function clear(tree, key) {
    tree.set(['session', key], []);
};
