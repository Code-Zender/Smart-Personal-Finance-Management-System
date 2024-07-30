const fs = require('fs').promises;
const path = require('path');

// Pfad zur Log-Datei
const logFilePath = path.join(__dirname, 'logs.json');

// Hilfsfunktion zum Hinzufügen eines Log-Eintrags
async function writeLog(type, message, data = null) {
    const logEntry = {
        type,
        message,
        timestamp: new Date().toISOString(),
        data
    };

    try {
        // Lese den Inhalt der Log-Datei
        let fileData = await fs.readFile(logFilePath, 'utf8');
        let logs = fileData.trim() ? JSON.parse(fileData) : [];

        // Füge den neuen Log-Eintrag hinzu
        logs.push(logEntry);

        // Schreibe die aktualisierte Liste zurück in die Log-Datei
        await fs.writeFile(logFilePath, JSON.stringify(logs, null, 2));
    } catch (err) {
        // Direkte Fehlerprotokollierung in der Konsole, um rekursive Fehler zu vermeiden
        console.error('Fehler beim Schreiben der Logdatei:', err);
    }
}

// Funktion zum sicheren Loggen von Fehlern
async function safeLogError(...args) {
    try {
        const maxLength = 1000; // Maximale Länge für jedes Argument
        const truncatedArgs = args.map(arg =>
            typeof arg === 'string' && arg.length > maxLength
                ? arg.slice(0, maxLength) + '...'
                : arg
        );
        const message = truncatedArgs.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
        ).join(' ');

        // Schreibe den Fehler in die Log-Datei
        await writeLog('error', message);
    } catch (err) {
        // Direkte Konsolenausgabe ohne rekursive Fehlerprotokollierung
        console.error('Fehler beim Loggen des Fehlers:', err);
    }
}

// Wrapper für console.log
function log(...args) {
    const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
    ).join(' ');


    // Schreibe den Log-Eintrag direkt in die Log-Datei
    writeLog('log', message).catch(err => {
        console.error('Fehler beim Schreiben des Log-Eintrags:', err);
    });
}

// Wrapper für console.error
function error(...args) {
    const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
    ).join(' ');
    safeLogError(message).catch(err => {
        console.error('Fehler beim Schreiben des Fehlerprotokolls:', err);
    });
}

// Wrapper für console.warn
function warn(...args) {
    const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
    ).join(' ');


    // Schreibe den Warnungseintrag direkt in die Log-Datei
    writeLog('warn', message).catch(err => {
        console.error('Fehler beim Schreiben der Warnung:', err);
    });
}

module.exports = {
    log,
    error,
    warn
};
