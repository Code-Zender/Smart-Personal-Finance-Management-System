const { connectDB, dbClient} = require('../server/db-connect.js');

connectDB().catch(console.dir);