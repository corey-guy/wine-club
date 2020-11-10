const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

/* DATABASE */
const mongo = require('mongodb');
const dbUrl = 'mongodb://localhost:27017/users'
mongoose.connect(dbUrl, {useNewUrlParse: true});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!");
})

/* SCHEMA */ 
const userSchema = new mongoose.Schema({
  fb_id: String,
  username: String,
  email: String,
  seasons: []
})

const User = mongoose.model('User', userSchema);

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

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(ojb, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: '',
    clientSecret: '',
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ["email", "name"]
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("facebook passport function");
    console.log(profile);
    
    User.findOne({ fb_id: profile._json.id }, function(err, user) {
      if(err) return console.log(err);
      if(user == null) {

        const new_user = new User({fb_id: profile._json.id, 
                  username: profile._json.first_name});

        new_user.save(function (err, user) {
          if(err) return console.log(err);
          console.log(user);
          console.log("new user saved!");
        })

      }
      else {
        user.fb_id = profile._json.id;
        user.username = profile._json.first_name;
        user.save();
      }
   });


    //User.findOrCreate({ facebookId: profile.id }, function (err, user) {
     // return cb(err, user);
    //});
  }
));



app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log('successful facebook auth');
    res.redirect('/');
  });

app.get('/fail', (req, res) => {
  res.send("failed attempt");
})

app.get('/', function(req, res) {
  console.log(req.user);
	res.send('welcome to express');
});

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res) {
    res.render('profile', {user: req.user});
  });
app.listen(port, () =>{
    console.info(`Application Started.  Port: ${port}`)
});

app.get("/users", (req, resp) => {

  let response_payload = ''
  User.find(function(err, users) {
    if (err) return console.error(err);
    console.log(users);
    resp.status(200).json(users);
  })
});
 
module.exports = app;
