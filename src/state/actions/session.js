export function error(tree, err) {
    tree.push(['session', 'errors'], err);
};

export function alert(tree, msg) {
    tree.push(['session', 'alerts'], msg);
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

export function clear(tree, key) {
    tree.set(['session', key], []);
};
