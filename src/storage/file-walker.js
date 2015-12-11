const fs = window.require('fs');
import path from 'path';
import {EventEmitter} from 'events';
import File from './file';

export default class FileWalker extends EventEmitter {
    constructor(baseDir) {
        super();
        this.baseDir = baseDir;
        this.depth   = 0;
        this.emits   = ['error', 'file', 'dir'];
    }

    run(read = false) {
        this.walk(this.baseDir, read);
    }

    walk(dir = this.baseDir, read = false, depth = 0) {
        if (this.depth && depth > this.depth) {
            return;
        }

        fs.readdir(dir, (err, filenames) => {
            if (err) {
                this.emit('error', err);
                return;
            }
            filenames.forEach(filename => {
                const fullpath = path.join(dir, filename);
                const file = new File(fullpath);
                file.on('ready', () => {
                    if (file.stats.isDirectory) {
                        this.emit('dir', file);
                        this.walk(fullpath, read, depth + 1);
                    } else if (file.stats.isFile) {
                        this.emit('file', file);
                    }
                });
                file.load(read);
            });
        });
    }
}
