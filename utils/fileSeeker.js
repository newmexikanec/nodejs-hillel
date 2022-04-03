const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const EventEmitter = require('events');
const { warn, error } = require("./logger");

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
        this._verbose && this.fileEventsLog(event, ...data);
        return super.emit(event, ...data);
    }

    fileEventsLog(event,...data) {
        fs.writeFile('./events.log', `[${new Date().toISOString()}][${event}] ${data}\n`, {flag: 'a+'}, err => {
            error(err);
        });
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
