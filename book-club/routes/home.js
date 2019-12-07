var express = require('express');

var router = express.Router();
var session = require('express-session');


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://root:12345@cluster0-w15wr.mongodb.net/book_club_db?retryWrites=true&w=majority";



/* GET home page. */
router.get('/', function(req, res, next) {
	console.log('home');
	if (req.session.login == null) {
		res.render('index');
	} else {
	const client = new MongoClient(uri, { useNewUrlParser: true });
	client.connect(err => {
		const collection = client.db("book_club_db").collection("clubs"); 
		collection.find().toArray().then(clubs => res.render('home', { clubs: clubs }));
		client.close();
		});
	}
});

router.get('/joined', function(req, res, next) {
	console.log('joined');
	if (req.session.login == null) {
		res.render('index');
	} else {
	const client = new MongoClient(uri, { useNewUrlParser: true });
	client.connect(err => {
		const collection = client.db("book_club_db").collection("user_club"); 
		collection.find({login: req.session.login}).toArray().then(clubs => res.render('joined', { clubs: clubs }));
		client.close();
		});
	}
});

router.get('/join', function(req, res, next) {
	if (req.session.login == null) {
		res.render('index');
	} else {
		var city = req.param('city');
		var state = req.param('state');
		var zip = req.param('zip');
		
		const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect(err => {
        const collection = client.db("book_club_db").collection("user_club");
  
        collection.insertOne({ login: req.session.login, city: city, state: state, zip: zip }, function(err, res) {
        if (err) throw err;
		
        });
		
		res.redirect('/home');
		client.close();
		});
	}
});

router.post('/addclub', function(req, res, next) {
	if (req.session.login == null) {
		res.render('index');
	} else {
		var city = req.param('city');
		var state = req.param('state');
		var zip = req.param('zip');
		
		const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect(err => {
        const collection = client.db("book_club_db").collection("clubs");
  
        collection.insertOne({ city: city, state: state, zip: zip }, function(err, res) {
        if (err) throw err;
		
        });
		
		res.redirect('/home');
		client.close();
		});
	}
});

router.get('/logout', function(req, res, next) {
	req.session.login = null;
	res.render('index');
});

router.get('/search', (req, res) => {

    var keyword = req.param('keyword');
	
	console.log('keyword: ' + keyword);
	
	const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("book_club_db").collection("clubs");
  
  collection.find({ $or: [
  {"city" : {$regex : ".*" + keyword + ".*"}}, 
  {"state" : {$regex : ".*" + keyword + ".*"}}, 
  {"zip" : {$regex : ".*" + keyword + ".*"}}
  ]}).toArray().then(clubs => res.render('home', { clubs: clubs }));
  
  // res.render('index', { title: 'Clubs:' + collection.find() });
  
  client.close();
});
});

module.exports = router;
