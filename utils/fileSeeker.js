const fsPromises = require('fs/promises');
const path = require('path');
const EventEmitter = require('events');

const emitter = new EventEmitter();

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
