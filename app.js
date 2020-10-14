const mongo = require('mongoskin');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// mongoskin initialization
const { toObjectID } = mongoskin.helper
const dbHost = '127.0.0.1'
const dbPort = 27017
const db = mongoskin.db('mongodb://${dbHost}:${dbPort}/local')

db.bind('messages').bind({
	findOneAndAddText: function(text, fn) {
		this.findOne({}, (error, document) => {
			if(error) {
				console.error(error)
				return process.exit(1)
			}
			console.info('findOne: ', document)
			document.text = text
			var id = document._id.toString() // store ID in string
			console.info('before saving: ' , document) 
			this.save(document, (error, count) => {
				if(error) {
					console.error(error)
					return process.exit(1)
				}

				console.info('save: ', count)
				return fn(count, id)
			})
		})
	}
})


//use of function findOneAndAddText
db.messages.findOneAndAddText('hi', (count, id) => {
	db.messages.find({
		_id: toObjectID(id)
	}).toArray((error, documents) => {
		if(error) {
			console.error(error)
			return process.exit(1)
		}
		console.info('find: ', documents)
		db.close()
		process.exit(1);
	})
})
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
