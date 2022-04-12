const fsPromises = require('fs/promises');
const path = require('path');
const EventEmitter = require('events');
const { warn, error } = require("./logger");
const { log } = require('./fslogger');

// Extended class of EventEmitter
class ExtEventEmitter extends EventEmitter {
    constructor(options) {
        super(options);
        this._verbose = false;
    }

    setVerbose(val) {
        this._verbose = val;
        warn(`[ExtEventEmitter] verbose mode: ${!!val}`);
    }

    emit(event, ...data) {
        this._verbose && log( `[${new Date().toISOString()}][${event}] ${data}`);
        return super.emit(event, ...data);
    }
}

const emitter = new ExtEventEmitter();

// Search file(target) in the directory(dirPath)
async function seek(target, dirPath) {
    try {
        await fsPromises.access(dirPath);
        const files = await fsPromises.readdir(dirPath);
        if (files.includes(target)) {
            emitter.emit('success', path.join(dirPath, target));
        } else {
            emitter.emit('fail', new Error(`File "${target}" is not found`));
        }
    } catch(err) {
        emitter.emit('fail', err);
    }
}

module.exports = {
    seek,
    emitter
};
