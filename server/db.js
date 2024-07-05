
const { MongoClient, ServerApiVersion } = require('mongodb');

const dbUri = `mongodb+srv://MarcZ:Gibmir5nutella!@cluster0.tpimwio.mongodb.net/?retryWrites=true&w=majority`;
const dbClient = new MongoClient(dbUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  try {
    await dbClient.connect();
    console.log("Connected to database");
    await dbClient.db("user").command({ ping: 1 });
    console.log("The cluster was pinged! It works!");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
}

async function addUser(data) {
  const result = await dbClient.db("user").collection('user-data').insertOne(data);
  console.log('Daten erfolgreich gespeichert:', data);
}

async function findUserByEmail(email) {
  return await dbClient.db("user").collection('user-data').findOne({ email });
}

async function clearCollection(collectionName) {
  const result = await dbClient.db("user").collection(collectionName).deleteMany({});
  console.log(`Cleared ${result.deletedCount} documents from the ${collectionName} collection`);
}

async function addTransaction(transaction) {
  const result = await dbClient.db("user").collection('user-transactions').insertOne(transaction);
  console.log('Transaktion erfolgreich gespeichert:', transaction);
}

async function getTransactions(userId) {
  try {
    const transactions = await dbClient.db("user").collection('user-transactions').find({ user_id: userId }).toArray();
    console.log(transactions);
    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

module.exports = {
  connectDB,
  addUser,
  findUserByEmail,
  clearCollection,
  addTransaction,
  getTransactions
};
