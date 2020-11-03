
const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('passport')


//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/*
app.post('/login',
	passport.authenticate('local', { successRedirect: '/',
									failureRedirect: '/login'}),
	function(req, res) {
		//if this function gets called, authentication was sucessful
		//`req.user` contains the authenticated user.
		console.log('login success');
		//res.redirect('/users/ + req.user.username');	
	}
);
 */

module.exports = app;
