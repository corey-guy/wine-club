const mongo = require('mongodb');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// mongodb initialization
const dbHost = '127.0.0.1' //localhost
const dbPort = 27017
const {Db, Server} = mongo

const db = new Db('local',
	new Server(dbHost, dbPort),
	{safe: true}
)

let db = function saveTeamToDB() {
	db.open((error, dbConnection)) => {
		if(error) {
			console.error(error);
			return process.exit();
		}

		console.log((db._state));
		const team = {
			league_type = 1
			player_id = 1;
		}
		dbConnect
		.collection
		.insert(item, (error, document) => {
			if(error) {
				console.log(error);
				return process.exit(1);
			}
			console.info('created/inserts: ', document)
			db.close()
			process.exit(0)
		}
			
	)
}
//middleware function for database access
// catch 404 and forward to error handler


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


 
module.exports = app;
