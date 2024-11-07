const fs = require('fs').promises;
const Url = "localhost"
const path = require('path');
const { stringify } = require('querystring');
const configPath = path.join(__dirname, '../configs/config.json');
let config;

async function loadConfig() {
    try {
        const data = await fs.readFile(configPath, 'utf8');
        config = JSON.parse(data);
    } catch (error) {
        console.error('Error loading config:', error);
    }
}

loadConfig();


async function saveInCache(email, code) {
    try {
        const link = config.routes.cache;
        let fileData;
        try {
            fileData = await fs.readFile(link, 'utf8');
        } catch (err) {
            if (err.code === 'ENOENT') {
                fileData = null; // Datei existiert nicht
            } else {
                throw err;
            }
        }
        let json;
        const data = { email, code };
        if (fileData) {
            json = JSON.parse(fileData);
            json.push(data);
        } else {
            json = [data];
        }
        await fs.writeFile(link, JSON.stringify(json, null, 2));
    } catch (err) {
        console.log("Error saving cache", err);
    }
}

async function readCache() {
    try {
        const link = config.routes.cache;
        
        const fileData = await fs.readFile(link, 'utf8');
        console.log(link,fileData)

        if (fileData) {
            return JSON.parse(fileData);
        } else {
            return [];
        }
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('Cache file does not exist');
            return [];
        } else {
            console.log('Error reading cache', err);
            throw err;
        }
    }
}

async function removeCache(email) {
    try {
        const link = config.routes.cache;
        const fileData = await fs.readFile(link, 'utf8');
        let json = JSON.parse(fileData);
        json = json.filter(user => user.email !== email);
        await fs.writeFile(link, JSON.stringify(json, null, 2));
        console.log('Data deleted');
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('Cache file does not exist');
        } else {
            console.log('Error deleting data', err);
        }
    }
}

async function getCodeByEmail(email) {
    const cache = await readCache();
    if (Array.isArray(cache)) {
        const user = cache.find(user => user.email === email);
        return user ? user.code : null;
    }
    return null;
}
async function isEmailInCache(email) {
    const cache = await readCache();
    if (Array.isArray(cache)) {
        return cache.some(user => user.email === email);
    }
    return false;
}

async function readCacheTimes() {
    const link = "timesOpend.json";

    try {
        const fileData = await fs.readFile(link, 'utf8');


        try {
            const parsedData = JSON.parse(fileData);
            return parsedData;
        } catch (jsonErr) {
            console.log('Error parsing JSON:', jsonErr);
            return { timesOpened: 0 }; // Rückgabe eines Standardwerts bei JSON-Fehler
        }
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('Cache file does not exist');
            return { timesOpened: 0 };
        } else {
            console.log('Error reading cache', err);
            throw err;
        }
    }
}

async function timesOpend() {


    try {
        const link = "timesOpend.json";
        let dataNow = await readCacheTimes();

        if (typeof dataNow === 'undefined' || typeof dataNow.timesOpened === 'undefined') {
            dataNow = { timesOpened: 0 };
        }

        let timesOpened = dataNow.timesOpened + 1;
        console.log('Times opened:', timesOpened);

        await fs.writeFile(link, JSON.stringify({ timesOpened: timesOpened }, null, 2));
  
    } catch (err) {
        console.log("Error saving cache", err);
    }
}


module.exports = {
    saveInCache,
    readCache,
    removeCache,
    getCodeByEmail,
    isEmailInCache,
    timesOpend
};
