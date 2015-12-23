export function query(tree, value) {
    tree.set(['session', 'query'], value);
};

export function setPage(tree, value) {
    tree.set(['session', 'page'], value);
};

export function error(tree, err) {
    tree.push(['session', 'errors'], err);
};

export function alert(tree, msg) {
    tree.push(['session', 'alerts'], msg);
};

export function action(tree, message, method, action = "Undo") {
    const actions = tree.select(['session', 'actions']);
    const index = actions.get().length;

    let innerMethod = method;
    method = (evt) => {
        innerMethod();
        removeAction(tree, index);
    };

    tree.push(['session', 'actions'], {message, method, action});
};

export function remove(tree, key, index = null) {
    const cursor = tree.select('session', key);
    if (index === null) {
        cursor.unset();
    } else {
        cursor.splice([index, 1]);
    }
}

export function removeError(tree, index) {
    remove(tree, 'errors', index);
};

export function removeAlert(tree, index) {
    remove(tree, 'alerts', index);
};

export function removeAction(tree, index) {
    remove(tree, 'actions', index);
};

export function clear(tree, key) {
    tree.set(['session', key], []);
};
