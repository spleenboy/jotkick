const fs = window.require('fs');
import uuid from 'uuid';
import path from 'path';
import {EventEmitter} from 'events';
import File from './file';

export default class FileWalker extends EventEmitter {
    constructor(baseDir) {
        super();
        this.id = uuid();
        this.baseDir = baseDir;
        this.depth = Infinity;
        this.throttle = 10;
        this.debug = true;
        this.filter = (filenames) => {return filenames};
        this.emits = ['error', 'file', 'dir', 'done'];
    }

    log(...args) {
        this.debug && console.debug.apply(console, [...args, this.id]);
    }

    trace(...args) {
        this.debug && console.trace.apply(console, [...args, this.id]);
    }

    run(read = false, stop = false) {
        const dir = new File(this.baseDir);
        dir.on('error', (err) => {this.emit('error', err)});
        dir.on('loaded', () => {
            this.trace("Starting walk of", this.baseDir);
            if (!dir.stats.isDirectory) {
                this.emit('error', new Error("Invalid directory"));
                return;
            }
            this.walk(dir, read, stop);
        });
        dir.load();
    }

    walk(dir, read, stop, depth = 0, remain = 0) {
        let queue = [];

        const stopping = (file) => {
            if (remain === 0 || stop && file && stop(file)) {
                this.emit('done');
                return true;
            }
            return false;
        };

        const next = () => {
            if (queue.length === 0) {
                return stopping();
            }

            const filename = queue.shift();
            const fullpath = path.join(dir.path.full, filename);
            const file = new File(fullpath);

            file.load(read);

            file.on('error', (err) => {
                this.emit('error', err);
                remain--;
                stopping();
            });

            file.on('loaded', () => {
                remain--;

                if (file.stats.isDirectory) {
                    this.emit('dir', file);
                    if (depth + 1 < this.depth) {
                        this.walk(file, read, stop, depth + 1);
                    }
                } else if (file.stats.isFile) {
                    this.emit('file', file);
                }

                if (!stopping(file)) {
                    setTimeout(next, this.throttle);
                }
            });
        };

        fs.readdir(dir.path.full, (err, filenames) => {
            !err || this.emit('error', err);
            remain += filenames.length;
            queue = this.filter(filenames);
            next();
        }); // fs.readdir
    }
}
