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
        this.trace("Starting walk of", this.baseDir);
        this.walk(dir, read, stop);
    }

    walk(dir, read, stop, depth = 0, remain = 0) {
        const queue = [];

        const stopping = (file) => {
            if (remain === 0 || stop && stop(file)) {
                queue.forEach(timer => {
                    clearTimeout(timer);
                });
                this.emit('done');
                return true;
            }
            return false;
        };

        const processFile = (filename, index) => {
            const fullpath = path.join(dir.path.full, filename);
            const file = new File(fullpath);

            file.load(read);

            file.on('error', (err) => {
                this.emit('error', err);
                remain--;
                stopping();
            });

            file.on('ready', () => {
                remain--;
                if (file.stats.isDirectory) {
                    this.emit('dir', file);
                    if (depth + 1 < this.depth) {
                        this.walk(file, read, stop, depth + 1);
                    }
                } else if (file.stats.isFile) {
                    this.emit('file', file);
                }
                stopping(file);
            });
        };

        fs.readdir(dir.path.full, (err, filenames) => {
            !err || this.emit('error', err);

            let lastStart = 0;
            remain += filenames.length;

            filenames.reverse();
            filenames.forEach((filename, index) => {
                let processor = processFile.bind(this, filename, index);
                queue.push(setTimeout(processor, lastStart));
                lastStart += this.throttle;
            });
        }); // fs.readdir
    }
}
