const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb+srv://MarcZ:Gibmir5nutella!@cluster0.tpimwio.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
    console.log("1");
});

const startServer = async () => {
    try {
        console.log("2");
        const client = await MongoClient.connect(url);
        console.log("3");
        console.log('Verbunden mit der MongoDB');
        const db = client.db('user'); // Datenbank auswählen

        // Route für den Datenempfang und -speicherung
        app.post('/submitData', async (req, res) => {
            const data = req.body;
            console.log("4");
            try {
                const result = await db.collection('user-data').insertOne(data);
                console.log('Daten erfolgreich gespeichert:', result.ops);
                res.status(200).json({ message: 'Daten erfolgreich gespeichert' });
            } catch (err) {
                console.log(err);
                res.status(500).json({ error: 'Fehler beim Speichern der Daten in der Datenbank' });
            }
        });

        app.listen(3000, () => console.log('Server gestartet auf http://localhost:3000'));
    } catch (err) {
        console.error('Fehler beim Verbindungsaufbau zur MongoDB:', err);
    }
};

startServer();
console.log("TEST");