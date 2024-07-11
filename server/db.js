
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb');
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
async function delTransaction(id) {
  try {
    // Convert string ID to ObjectId
    const objectId = new ObjectId(id);

    const result = await dbClient.db("user").collection("user-transactions").deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      console.log("No transaction found with the provided ID.");
    } else {
      console.log("Transaction successfully deleted: " + JSON.stringify(result));
    }

    return result;
  } catch (error) {
    console.error("Error deleting transaction: ", error);
    throw error;
  }
}

async function editTransaction(id, type, amount, currency, category, description, frequency, date) {
  console.log(id, amount, currency, category, description, frequency, date)

  const filter = { _id: new ObjectId(id) };
  const update = {
    $set: {
      type,
      amount,
      currency,
      category,
      description,
      frequency,
      date,
    }
  };
  console.log(filter,update)
  await dbClient.db("user").collection("user-transactions").updateOne(filter, update);
  obj = await dbClient.db("user").collection('user-transactions').find({ _id: new ObjectId(id) })

  return await dbClient.db("user").collection('user-transactions').find({ user_id: obj.user_id }).toArray();
}

module.exports = {
  connectDB,
  addUser,
  findUserByEmail,
  clearCollection,
  addTransaction,
  getTransactions,
  delTransaction,
  editTransaction
};
