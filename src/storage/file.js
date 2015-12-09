import fs from 'fs';
import path from 'path';
import {EventEmitter} from 'events';

export default File {
    constructor(fullpath) {
        this.path = path.parse(fullpath);
        this.path.full = fullpath;

        this.loaded = false;
        this.stats = null;
        this.content = null;
    }

    load(read) {
        fs.stats(this.path.full, (err, stats) => {
            if (err) {
                this.emit('error', err, this);
                return;
            }

            this.stats = stats;
            this.stats.isFile = stats.isFile();
            this.stats.isDirectory = stats.isDirectory();

            if (!read || !this.stats.isFile) {
                this.emit('ready', this);
                this.loaded = true;
                return;
            }

            fs.readFile(this.path.full, (err, data) => {
                if (err) {
                    this.emit('error', err, this);
                    return;
                }
                this.content = data;
                this.emit('ready', this);
            });
        });
    }
}
