const { connectDB, dbClient, add } = require('../server/db.connect.js');
const express = require('express');
const os = require('os');
const app = express();
const port = process.env.PORT || 3.75.158.163;

// Middleware für JSON Parsing
app.use(express.json());

app.get('/login/register.js', (req, res) => {
    const dataa = req.body;
    console.log(dataa);
    res.send("Data received");
});

app.listen(port, () => {
    // Netzwerk-Interfaces abrufen
    const networkInterfaces = os.networkInterfaces();
    let ipAddresses = [];

    // IP-Adressen sammeln
    for (const interfaceName of Object.keys(networkInterfaces)) {
        for (const interfaceInfo of networkInterfaces[interfaceName]) {
            if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal) {
                ipAddresses.push(interfaceInfo.address);
            }
        }
    }

    // IP-Adressen anzeigen
    ipAddresses.forEach(ip => {
        console.log(`Example app listening at http://${ip}:${port}`);
    });

    if (ipAddresses.length === 0) {
        console.log(`Example app listening on port ${port}, but no external IP address found.`);
    }
});

connectDB().catch(console.dir);

const data = { TEST: "TEST" };
add(data);
console.log("TEST");
