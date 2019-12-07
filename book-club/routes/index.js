var express = require('express');
var router = express.Router();


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://root:12345@cluster0-w15wr.mongodb.net/book_club_db?retryWrites=true&w=majority";

var session = require('express-session');


router.post('/login', (req, res) => {

   var login = req.param('login');
   var password = req.param('password');
   
   const client = new MongoClient(uri, { useNewUrlParser: true });
   client.connect(err => {
	   const collection = client.db("book_club_db").collection("users");
	   
	   collection.find({ $and: [
	   {"login" : login}, {"password" : password}
	   ]}).count().then((count) => {
		   console.log(count);
		   if (count > 0) {
		   console.log('found login');
		   req.session.login = login;
		   res.redirect('/home');
	   } else {
		   console.log('not found login');
	       res.render('index');
	   }
	   });
	   
	  
	  client.close(); 
});
});

router.get('/', (req, res) => {

   res.render('index');
});

router.get('/signup', (req, res) => {

   res.render('signup');
});

module.exports = router;
