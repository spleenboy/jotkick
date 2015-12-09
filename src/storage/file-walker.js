import fs from 'fs';
import path from 'path';
import {EventEmitter} from 'events';

export default class FileWalker extends EventEmitter {
    constructor(baseDir) {
        this.baseDir = baseDir;
        this.emits   = ['error', 'file', 'dir'];
        super();
    }

    run(read = false) {
        this.walk(this.baseDir, read);
    }

    walk(dir = this.baseDir, read = false) {
        fs.readdir(dir, (err, filenames) => {
            if (err) {
                this.emit('error', err);
                return;
            }
            filenames.forEach(filename => {
                const fullpath = path.join(dir, filename);
                const file = new File(fullpath);
                file.on('ready', (f) => {
                    if (f.stats.isDirectory) {
                        this.emit('dir', f);
                        this.walk(fullpath, read);
                    } else if (f.stats.isFile) {
                        this.emit('file', f);
                    }
                });
                file.load(read);
            });
        });
    }
}
