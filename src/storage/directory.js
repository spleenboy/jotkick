import fs from 'fs';
import path from 'path';
import {EventEmitter} from 'events';

export default class Directory {
    constructor(fullpath) {
        this.fullpath = fullpath;
        this.loaded   = false;
    }
}
