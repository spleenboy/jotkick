const fs = window.require('fs');
const mkdirp = window.require('mkdirp');
import path from 'path';
import pathParse from 'path-parse';
import {EventEmitter} from 'events';

const NOTFOUND = 34;

export default class File extends EventEmitter {
    constructor(fullpath) {
        super();
        this.path = pathParse(fullpath);
        this.path.full = fullpath;

        this.loaded = false;
        this.stats = null;
        this.content = null;
    }

    exists(fullpath = this.path.full) {
        try {
            fs.accessSync(fullpath);
            return true;
        } catch (err) {
            return err.errno === NOTFOUND;
        }
    }

    mkdirs(callback) {
        if (this.exists()) {
            callback();
        }

        let dirPath = this.path.ext ? this.path.dir : this.path.full;
        mkdirp(dirPath, (err) => {
            if (err) {
                this.emit('error', err);
            } else {
                this.emit('created');
            }
            callback && callback(err);
        });
    }

    delete() {
        fs.unlink(this.path.full, (err) => {
            if (err) {
                this.emit('error', err);
                return;
            }
            this.emit('deleted');
        });
    }

    write(content) {
        this.mkdirs((err) => {
            if (err) {
                return;
            }
            fs.writeFile(this.path.full, content, (err) => {
                if (err) {
                    this.emit('error', err);
                    return;
                }
                this.emit('written');
            });
        });
    }

    load(read = false) {
        fs.stat(this.path.full, (err, stats) => {
            if (err) {
                this.emit('error', err, this);
                return;
            }

            this.loaded = true;

            this.stats = stats;
            this.stats.isFile = stats.isFile();
            this.stats.isDirectory = stats.isDirectory();

            if (!this.stats.isFile || read === false) {
                this.emit('ready');
                return;
            }

            if (typeof read === 'function' && !read(this)) {
                this.emit('ready');
                return;
            }

            fs.readFile(this.path.full, {encoding: 'utf-8'}, (err, data) => {
                if (err) {
                    this.emit('error', err, this);
                    return;
                }
                this.content = data;
                this.emit('ready');
                return;
            });
        });
    }
}
