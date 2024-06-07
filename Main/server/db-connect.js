const { MongoClient, ServerApiVersion } = require('mongodb');

const dbUri = `mongodb+srv://MarcZ:Gibmir5nutella!@cluster0.tpimwio.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
  }
  catch (error) {
    console.log(error.stack);
  }
}


module.exports = {
    dbClient,
    connectDB
};