const express = require('express');
const fs = require('fs');
const path = require('path');
const favicon = require('serve-favicon');
const { info } = require('./utils/logger');
const { log } = require('./utils/fslogger');
const { itemsProvider } = require('./services');

const app = express();
const LIST_URL = 'http://localhost';
const LIST_PORT = 3000;

app.use((req, res, next) => {
    log(`[${new Date().toISOString()}] ${req.url}`);
    if (!['/', '/index.html', '/favicon.ico'].includes(req.url)) {
        res.redirect('/');
    }
    next();
});
app.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')));
app.route('/')
    .get((req, res) => {
        let template = '';
        const index$ = fs.createReadStream(path.join(__dirname, 'assets', 'index.html'), {encoding: 'utf8'});

        index$.on('data', data => {
            template += data;
        });
        index$.on('end', async () => {
            const items = await itemsProvider.getData();
            const list = items
                .map(itm => `<li>[${itm.date}] ${itm.value}</li>`)
                .join('\n');
            res.send(template.replace('{{list}}', list));
        });
        index$.on('error', () => {
            res.status(500).send('Unexpected Error');
        });
    })
    .post((req, res) => {
        let body = '';

        req.on('data', data => {
            body += data;
        });
        req.on('end', async () => {
            if (body.split('=')[1]) {
                await itemsProvider.setItem({
                    value: body.replace('value=', ''),
                    date: new Date().toISOString()
                });
            }
            res.redirect('/');
        });
    });

app.listen(LIST_PORT, () => {
    info(`Server is listening ${LIST_URL}:${LIST_PORT}`);
});
