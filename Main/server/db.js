console.log("A")
const { MongoClient, ServerApiVersion } = require('mongodb');
console.log("A")
const uri = "mongodb+srv://MarcZ:Gibmir5nutella!@cluster0.tpimwio.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
console.log("A")
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
console.log("b")
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
console.log("b")
async function run(docs) {
  try {
    console.log("b")
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    console.log("c")
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const db = client.db("user");
    const coll = db.collection("user-data");
    
    const result = await coll.insertMany(docs);

    const cursor = coll.find({ Email: "marc.falkensee@gmail.com" });

    // iterate code goes here
    await cursor.forEach(console.log);
  } finally {
    // database and collection code goes here
    






    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
function TEst(data){
  run(data).catch(console.dir);

}




