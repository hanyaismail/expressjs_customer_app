var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId

// mongojs(nama database, ['nama collection'])
var db = mongojs('customerapp', ['users']);

var app = express();

// //middleware
// urutan penting
// var logger = function(req, res, next){
// 	//muncul di git/cmd
// 	console.log('Logging...');
// 	next();
// }

// app.use(logger);

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// body parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set static Path
//Path ke tempat nyimpen css, jquery, dll.
//Override apa yang ada di app.js
app.use(express.static(path.join(__dirname, 'public')));

//Global Vars
app.use(function(req, res, next){
	res.locals.errors = null;
	next();
});

// var people = [
// 	{
// 		name:'Jeff',
// 		age: 30
// 	},
// 	{
// 		name: 'Sara',
// 		age: 22
// 	},
// 	{
// 		name: 'Bill',
// 		age: 40
// 	}
// ]

//validator middleware
app.use(expressValidator());

// var users = [
// 	{
// 		id: 1,
// 		first_name:'John',
// 		last_name:'Doe',
// 		email:'johndoe@gmail.com',
// 	},
// 	{
// 		id: 1,
// 		first_name:'Bob',
// 		last_name:'Smith',
// 		email:'bobsmith@gmail.com',
// 	},
// 	{
// 		id: 1,
// 		first_name:'Jill',
// 		last_name:'Jackson',
// 		email:'jilljackson@gmail.com',
// 	}
// ]

//handle GET request (dari url browser)
app.get('/', function(req, res){

	//database
	db.users.find(function (err, docs) {
		console.log(docs);
		//yang muncul di browser
		// res.json(people);
		res.render('index', {
			title: 'Customers',
			users: docs
		});	
	});
});

app.post('/users/add', function(req, res){
	
	//validator
	req.checkBody('first_name', 'First Name Required').notEmpty();
	req.checkBody('last_name', 'Last Name Required').notEmpty();
	req.checkBody('email', 'Email Required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('index', {
			title: 'Customers',
			users: users,
			errors: errors
		});
		console.log('error');
	} else {
		var newUser = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email
		}	
		
		db.users.insert(newUser, function(err, result){
			if(err){
				console.log(err);
			}
			res.redirect('/');
		});
		//muncul di terminal
		console.log(newUser);
	}
});

app.delete('/users/delete/:id', function(req, res){
	//muncul di terminal
	db.users.remove({_id: ObjectId(req.params.id)}, function(err, result){
		if(err){
			console.log(err);
		}
		res.redirect('/');
	});
	console.log(req.params.id);
});

app.listen(3000, function(){
	console.log('Server Started on port 3000');
})