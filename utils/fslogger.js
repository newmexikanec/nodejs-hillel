const { error } = require('./logger');
const fs = require('fs');

function log(data) {
    const str$ = fs.createWriteStream('./events.log', {
        encoding: 'utf-8',
        flags: 'a'
    });

    str$.write(`${data}\n`);
    str$.on('error', err => error(err));
}

module.exports = {
    log
}
