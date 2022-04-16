const fs = require('fs');
const path = require('path');
const {response} = require("express");

class ItemDataProvider {
    constructor() {
        this._cache = null;
        this._filePath = path.join(__dirname, '..', 'data', 'list.json');
    }

    async getData() {
        if (this._cache) {
            return this._cache;
        }

        try {
            fs.accessSync(this._filePath);
        } catch {
            this._cache = [];
            return this._cache;
        }

        const file$ = fs.createReadStream(this._filePath, {encoding: 'utf8'});
        const data = await new Promise((res, rej) => {
            let result = '';
            file$.on('data', data => {
                result += data;
            });
            file$.on('end', () => {
                res(result);
            });
            file$.on('error', rej);
        });

        this._cache = JSON.parse(data);
        return this._cache;
    }

    async setItem(item) {
        if (!this._cache) {
            this._cache = await this.getData();
        }
        this._cache.push(item);
        const file$ = fs.createWriteStream(this._filePath, {encoding: 'utf8'});
        file$.end(JSON.stringify(this._cache));
    }
}

const itemsProvider = new ItemDataProvider();

module.exports = itemsProvider;
