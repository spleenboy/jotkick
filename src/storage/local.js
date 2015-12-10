/**
 * Wrapper for local storage that handles setting data
 * asynchronously. Each method returns a promise that is
 * resolved with the result of the call;
**/
export default class Local {
    constructor(api = window.localStorage) {
        this.api = api;
    }

    serialize(data) {
        if (!data) return '';
        return JSON.stringify(data);
    }

    deserialize(json) {
        return JSON.parse(json);
    }

    promise(action, ...args) {
        return new Promise((resolve, reject) => {
            try {
                const result = action.apply(this.api, args);
                resolve(result);
            } catch (e) {
                console.error("Error applying action to args", action, args);
                reject(e);
            }
        });
    }

    key(i) {
        return this.promise(this.api.key, i);
    }

    getItem(key) {
        return this.promise(this.api.getItem, key).
            then((json) => {
                return this.deserialize(json);
            });
    }

    setItem(key, value) {
        const json = this.serialize(value);
        return this.promise(this.api.setItem, key, json);
    }

    removeItem(key) {
        return this.promise(this.api.removeItem, key);
    }

    clear() {
        return this.promise(this.api.clear);
    }
}
