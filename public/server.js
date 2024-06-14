
const { connectDB, dbClient,add} = require('../server/db.connect.js');


const express = require('express')
const app = express()
const port = process.env.PORT || 4000;
app.get('/', (req, res) => {
    dataa = req.body() 
    console.log(dataa)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

connectDB().catch(console.dir);
data= {TEST:"TEST"}
add(data);
console.log("TEST")