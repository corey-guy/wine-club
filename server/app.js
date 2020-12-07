
const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const mongoose = require('mongoose');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const session = require("express-session");
const dns = require('dns')

let facebookSecret = require('./facebookSecret');
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
    secret: "wineclub",
    resave: false,
    saveUninitialized: true
 }));

/* DATABASE */
const mongo = require('mongodb');
const dbUrl = 'mongodb://localhost:27017/users'
mongoose.connect(dbUrl, {useNewUrlParse: true});
const db = mongoose.connection;
const db2 = db.useDb('clubs');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!");
})

db2.on('error', console.error.bind(console, 'connection error:'));
db2.once('open', function() {
  console.log("we are connected!");
})

/* SCHEMA */ 
const userSchema = new mongoose.Schema({
  fb_id: String,
  username: String,
  email: String,
  password: String,
  clubs: []
})


const User = mongoose.model('User', userSchema);

const clubSchema = new mongoose.Schema({
  name: String,
  game: String,
  startdate: String,
  numWeeks: String,
  owner: String,
  members: [String]
})

const Club = mongoose.model('Club', clubSchema);

//Set up Cors
const whitelist = ['http://localhost', 
                   'http://localhost:3000', 
                   'http://localhost:8000',
                   'http://localhost:80',
                   'http://127.0.0.1:8000'];

const corsOptions = {
  credentials: true, 
  origin: (origin, callback) => {
      console.log("origin:" + origin);
      if ( whitelist.includes(origin) ) {
          return callback(null, true)
      }
      callback(new Error('Not allowed by CORS'));
  }
}

app.use(cors(corsOptions));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(ojb, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: facebookSecret.clientID,
    clientSecret: facebookSecret.clientSecret,
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
      console.log("passport function exit");
   });


    //User.findOrCreate({ facebookId: profile.id }, function (err, user) {
     // return cb(err, user);
    //});
  }
));



app.get('/auth/facebook',
  passport.authenticate('facebook'))

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/fail' }),
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

app.get("/users", (req, resp) => {

  let response_payload = ''
  User.find(function(err, users) {
    if (err) return console.error(err);
    console.log(users);
    resp.status(200).json(users);
  })
});

app.post('/', function(req, res) {
  console.log("middleware");
  res.send('welcome to express');
});

app.post("/user", (req, resp) => {
  console.log("you've hit the user endpoint");
  let body = req.body;
  console.log(body);
  
  User.findOne({ username: req.body.username }, function(err, user) {
    if(err) return console.log(err);
    if(user == null) {
      const new_user = new User({ fb_id: null,
                                  username: req.body.username,
                                  email: req.body.email,
                                  password: req.body.password});
      new_user.save(function (err, user) {
        if(err) return console.log(err);
        console.log(user);
        console.log("new user saved!");
      })
      setSessionUsername(req, req.body.username);

      resp.status(200).json(req.session.data);
    }
    else {
      console.log("this user with this username has already been created");
      resp.status(403).json("error");
    }
  })
});

app.post("/authUser", (req, resp) => {
  console.log("hit auth user endpoint");
  let user = req.body;
  console.log(user);

  User.findOne({ username: req.body.username, password: req.body.password }, function(err, user) {
    if(err) return console.log(err);
    if(user == null) {
      resp.status(403).json("error");
    }
    else {
      console.log("login successful for: " + req.body.username);
      
      setSessionUsername(req, req.body.username);

      resp.status(200).json(req.session.data);
    }
  })
});

function setSessionUsername(req, username) {
  if(!req.session.data) {
    req.session.data = [];
    console.log("initializing session data");
  }
        
  let data = { username: username };
  req.session.data = data;
  console.log(req.session.data);
}

function getSessionUsername(req) {
  if(!req.session.data) {
    return "error";
  }
  else {
    return req.session.data.username;
  }
}

function setSessionClub(req, clubId) {
  if(req.session.data) {
    req.session.data["currentClub"] = clubId;
  }

}

app.post("/club", (req, resp) => {
  console.log("you've hit the club endpoint");
  //console.log(req);
  let body = req.body;
  console.log(body);
  Club.findOne({ name: req.body.name }, function(err, club) {
      if(err) return console.log(err);
      if(club == null) {

        const new_club = 
                new Club({
                          name: req.body.name, 
                          game: req.body.game,
                          startdate: req.body.startDate,
                          numWeeks: req.body.numWeeks,
                          owner: req.session.data.username
                });

        new_club.members.push(req.session.data.username);

        new_club.save(function (err, club) {
          if(err) return console.log(err);
          console.log(club);
          console.log("new club saved!");
          resp.status(200).json(club);
        })
      }
      else {
        console.log("this club with club name has already been created");
          resp.status(403).json("error");
      }
   });
});

app.post("/club/roster", (req, res) => {
  console.log("You've hit the add member endpoint");
  console.log(req.body);
  Club.findOne({ _id: req.body.id }, function(err, club) {
    if(err) {
      res.status(403).json("not a valid code");
      return console.log(err);
    }
    if(club == null) {
      res.status(403).json("error");
    }
    else {
      console.log(club.members);
      console.log(req.session.data.username);
      if(club.members.includes(req.session.data.username)) {
        res.status(403).json("already_member");
      }
      else {
        club.members.push(req.session.data.username);
        club.save(function(err,club) {
          if(err) return console.logg(err);
          console.log(club);
          console.log("member added!");
          res.status(200).json(club);

        })
      }
    }
  })
});

app.get('/club/:id', function(req, res) {
    console.log(req.params.id);
    Club.findOne({ _id: req.params.id }, function(err, club) {
      if(err) return console.log(err);
      if(club == null) {
        res.status(403).json("error");
      }
      else {
        setSessionClub(req, req.params.id);
        res.status(200).json(club);
      }
    });
});

app.get('/club/roster/:id', function(req, res) {
    Club.findOne({ _id: req.params.id }, function(err, club) {
      if(err) return console.log(err);
      if(club == null) {
        res.status(403).json("error");
      }
      else {
        res.status(200).json(club.members);
      }
    });
});

app.get('/user/clubs', function(req, res) {
  
  console.log("get clubs");
  let username = getSessionUsername(req);
  if(username=="error") {
    res.status(200).json("error");
  }
  else {
    Club.find({ members: username }, function (err, docs) {
      console.log(docs);
      res.status(200).json(docs);
    });
  }

});


app.listen(port, () =>{
    dns.lookup('graph.facebook.com', console.log)
    console.info(`Application Started.  Port: ${port}`);
    console.info(`facebookSecret.clientID: ${facebookSecret.clientID}`);
    console.info(`facebookSecret.clientSecret: ${facebookSecret.clientSecret}`);
});
module.exports = app;
