var express=require("express");
var path=require('path');
var app =express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:/";



app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	extended: true
}));
app.post('/login',function(req,res){
     var x=req.body.x;
    var y=req.body.y;
     var data={
     
        "x_op":x,
        "y_op":y
    }
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var myobj = { x: `${x}`, y: `${y}`};
      dbo.collection("customers").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    });
       

    res.set({
		'Access-Control-Allow-Origin' : '*'
	});

  res.send(JSON.stringify(data));


});
app.get('/tb',function(req,res){
  var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  
  dbo.collection("customers").find({}).toArray(function(err, result) {
    if (err) throw err;
    var obj = '$(result)';
    for (var i = 0; i < obj.length; i++){
      app.locals.obj=result;
    db.close();
    }

  });
});
});