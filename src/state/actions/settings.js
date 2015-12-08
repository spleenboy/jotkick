export function update(tree, key, value) {
    tree.set(['settings', key], value);
};
