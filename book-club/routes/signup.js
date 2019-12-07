var express = require('express');
var router = express.Router();


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://root:12345@cluster0-w15wr.mongodb.net/book_club_db?retryWrites=true&w=majority";


router.post('/', function(req, res, next) {
	
	var login = req.param('login');
	var password = req.param('password');
	
	console.log('loginpassword: ' + login + ' ' + password);
	
	const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("book_club_db").collection("users");
  
  collection.insertOne({ login: login, password: password }, function(err, res) {
    if (err) throw err;
	
  });

  res.render('index');
  client.close();
  
});
});

module.exports = router;
