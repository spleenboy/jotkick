const fs = window.require('fs');
import uuid from 'uuid';
import path from 'path';
import {EventEmitter} from 'events';
import File from './file';

export default class FileWalker extends EventEmitter {
    constructor(baseDir) {
        super();
        this.id      = uuid();
        this.baseDir = baseDir;
        this.depth   = Infinity;
        this.remain  = 0;
        this.debug   = false;
        this.emits   = ['error', 'file', 'dir', 'done'];
    }

    log(...args) {
        this.debug && console.debug.apply(console, [...args, this.id]);
    }

    trace(...args) {
        this.debug && console.trace.apply(console, [...args, this.id]);
    }

    run(read = false) {
        this.remain = 0;
        this.trace("Starting walk of", this.baseDir);
        this.walk(this.baseDir, read);
    }

    walk(dir = this.baseDir, read = false, depth = 0) {

        if (depth > this.depth) {
            this.remain = 0;
            this.emit('done');
            return;
        }

        fs.readdir(dir, (err, filenames) => {

            if (err) {
                this.emit('error', err);
                this.remain--;
                if (this.remain === 0) {
                    this.emit('done');
                }
                return;
            }

            this.remain += filenames.length;

            this.log('Directory', dir, 'at depth', depth, 'contains', filenames);

            if (this.remain === 0) {
                this.emit('done');
                return;
            }

            filenames.forEach((filename, i) => {
                const fullpath = path.join(dir, filename);
                const file = new File(fullpath);

                this.log('Processing path', i, fullpath);

                file.load(read);

                file.on('error', (err) => {
                    this.emit('error', err);
                    this.remain--;
                    if (this.remain === 0) {
                        this.emit('done');
                        return;
                    }
                });

                file.on('ready', () => {

                    if (file.stats.isDirectory) {
                        this.emit('dir', file);
                        this.walk(fullpath, read, depth + 1);
                    } else if (file.stats.isFile) {
                        this.emit('file', file);
                    }

                    this.remain--;
                    if (this.remain === 0) {
                        this.emit('done');
                    }
                }); // file.on

            }); // filenames.forEach

        }); // fs.readdir
    }
}
