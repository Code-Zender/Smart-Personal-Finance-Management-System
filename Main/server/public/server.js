
const { connectDB, dbClient,add} = require('../server/db.connect.js');

connectDB().catch(console.dir);
data= {deineMutter:"IUGBGBGBGBGBGBGBGBGBGBGB"}
add(data);
