const { connectDB, dbClient} = require('../server/server.js');

connectDB().catch(console.dir);