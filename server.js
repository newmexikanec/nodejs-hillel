const http = require('http');
const fs = require('fs');
const path = require('path');
const { info } = require('./utils/logger');
const { log } = require('./utils/fslogger');

const server = http.createServer();
const LIST_URL = 'http://localhost';
const LIST_PORT = 3000;

server.on('request', (req, res) => {
    log(`[${new Date().toISOString()}] ${req.url}`);

    if (['/', '/index.html'].includes(req.url)) {
        fs.createReadStream('./assets/index.html').pipe(res);
    } else if (req.url === '/favicon.ico') {
        const { pathname } = new URL(req.url, LIST_URL);
        res.setHeader('content-type', 'image/x-icon');
        fs.createReadStream(path.join(__dirname, '/assets', pathname)).pipe(res);
    } else {
        res.statusCode = 404;
        res.end();
    }
});

server.listen(LIST_PORT, () => {
    info(`Server is listening ${LIST_URL}:${LIST_PORT}`);
});
