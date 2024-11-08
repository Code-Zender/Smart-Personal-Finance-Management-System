const Url = "localhost"; // Ändere dies basierend auf Codespace/localhost/serverUrl
const express = require('express');
const path = require('path');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '/modules/configs/config.json'), 'utf8'));
const app = express();
const port = 6543;
const cors = require('cors');
const { exec, execSync, spawn } = require('child_process');
require('better-logging')(console)
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../Main')));
console.logLevel = 4

let serverProcess = null;

app.post('/restart', (req, res) => {
  res.send('Server wird neu gestartet...');
  logMessage('log', 'Server wird neu gestartet...');
  setTimeout(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
    serverProcess = spawn('node', [path.join(__dirname, 'server.js')], {
      detached: true,
      stdio: 'ignore'
    });
    serverProcess.unref();
    logMessage('log', 'Server erfolgreich neu gestartet');
  }, 1000); // Verzögerung von 1 Sekunde, um sicherzustellen, dass die Antwort gesendet wird
});

app.post('/stop', (req, res) => {
  res.send('Server wird gestoppt...');
  logMessage('log', 'Server wird gestoppt...');
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
    logMessage('log', 'Server erfolgreich gestoppt');
  } else {
    logMessage('warn', 'Server ist bereits gestoppt');
  }
});

app.post('/start', (req, res) => {
  res.send('Server wird gestartet...');
  logMessage('log', 'Server wird gestartet...');
  if (!serverProcess) {
    serverProcess = spawn('node', [path.join(__dirname, 'server.js')], {
      detached: true,
      stdio: 'ignore'
    });
    serverProcess.unref();
    logMessage('log', 'Server erfolgreich gestartet');
  } else {
    logMessage('warn', 'Server läuft bereits');
  }
});

app.post('/status', (req, res) => {
  const status = serverProcess ? 'running' : 'stopped';
  res.json({ status: `Server status: ${status}` });
});

app.post('/logs', (req, res) => {
  const logFilePath = path.join(__dirname, './modules/data/logs.json');
  console.log(logFilePath)
  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading log file');
      return;
    }
    let logs;
    try {
      logs = JSON.parse(data || '[]');
    } catch (parseErr) {
      res.status(500).send('Error parsing log file');
      return;
    }
    res.json(logs);
  });
});


app.post('/clearLogs', (req, res) => {
  const logFilePath = path.join(__dirname, 'logs.json');
  fs.writeFile(logFilePath, '[]', (err) => {
    if (err) {
      res.status(500).send('Error clearing log file');
      return;
    }
    res.send('Logs cleared');
  });
});


;

app.get('/config', (req, res) => {
  res.sendFile(path.join(__dirname, config.routes.config));
});

app.get('/Dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, config.routes.Dashboard));
});

app.listen(port, () => {
  console.log(`Server running at ${Url}`);
  console.log("Server started at " + new Date());
  runTime(serverStartTime = Date.now());
});


function runTime(serverStartTime) {
  setInterval(() => {
    const seconds = Math.floor((Date.now() - serverStartTime) / 1000);
    // Add functionality as needed
  }, 1000);
}


function logMessage(type, message) {
    const logEntry = {
        type,
        message,
        timestamp: new Date().toISOString(),
        data: null
    };
    console.log(__dirname)
    const logFilePath = path.join(__dirname, './modules/data/logs.json');
    console.log(logFilePath)
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading log file:', err);
            return;
        }
    
        const logs = JSON.parse(data || '[]');
        
        logs.push(logEntry);
        fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), (err) => {
            if (err) {
                console.error('Error writing to log file:', err);
            }
        });
    });
}















