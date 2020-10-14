const express = require("express");
const cookieParser = require('cookie-parser');
const passport = require('passport')


let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Set up Cors
const whitelist = ['http://localhost', 
                   'http://localhost:3000', 
                   'http://localhost:8000'];

const corsOptions = {
  credentials: true, 
  origin: (origin, callback) => {
      console.log(origin);
      if ( whitelist.includes(origin) ) {
          return callback(null, true)
      }
      callback(new Error('Not allowed by CORS'));
  }
}

app.get('/', function(req, res) {
	res.send('welcome to express');

});
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
app.listen(port, () =>{
    console.info(`Application Started.  Port: ${port}`)
});
 
module.exports = app;
