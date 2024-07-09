const fs = require('fs').promises;

async function loadConfig() {
    console.log("TEST");
    try {
        const response = await fetch('/config');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const config = await response.json();
        return config
    } catch (error) {
        console.error('Error loading config:', error);
    }
}



async function saveInCache(email, code) {
    console.log("A");
    config = await loadConfig()
    link = config.routes.cache
    try {
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
        console.log(json);
        await fs.writeFile(link, JSON.stringify(json, null, 2));
    } catch (err) {
        console.log("Error saving cache", err);
    }
}

async function readCache() {
    try {
        const fileData = await fs.readFile('../Main/server/cache.json', 'utf8');
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
        const fileData = await fs.readFile('../Main/server/cache.json', 'utf8');
        let json = JSON.parse(fileData);
        json = json.filter(user => user.email !== email);
        await fs.writeFile('../Main/server/cache.json', JSON.stringify(json, null, 2));
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

module.exports = {
    saveInCache,
    readCache,
    removeCache,
    getCodeByEmail,
    isEmailInCache
};
