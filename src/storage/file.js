const fs = window.require('fs');
import path from 'path';
import pathParse from 'path-parse';
import {EventEmitter} from 'events';

export default class File extends EventEmitter {
    constructor(fullpath) {
        super();
        this.path = pathParse(fullpath);
        this.path.full = fullpath;

        this.loaded = false;
        this.stats = null;
        this.content = null;
    }

    exists() {
        try {
            fs.accessSync(this.path.full);
            return true;
        } catch (e) {
            return false;
        }
    }

    create() {
        if (this.exists()) {
            this.emit('error', new Error("File already exists"));
            return false;
        }

        if (this.path.ext) {
            fs.open(this.path.full, 'wx', (err, fd) => {
                if (err) {
                    this.emit('error', err);
                }
                fs.close(fd);
                this.emit('created');
            });
        } else {
            fs.mkdir(this.path.full, (err) => {
                if (err) {
                    this.emit('error', err);
                    return;
                }
                this.emit('created');
            });
        }
    }

    write(content) {
        fs.writeFile(this.path.full, content, (err) => {
            if (err) {
                this.emit('error', err);
                return;
            }
            this.emit('written');
        });
    }

    load(read) {
        fs.stats(this.path.full, (err, stats) => {
            if (err) {
                this.emit('error', err, this);
                return;
            }

            this.loaded = true;

            this.stats = stats;
            this.stats.isFile = stats.isFile();
            this.stats.isDirectory = stats.isDirectory();

            if (!read || !this.stats.isFile) {
                this.emit('ready');
                return;
            }

            fs.readFile(this.path.full, (err, data) => {
                if (err) {
                    this.emit('error', err, this);
                    return;
                }
                this.content = data;
                this.emit('ready');
            });
        });
    }
}
