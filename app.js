var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var main = require('./routes/main');

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');


//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendfile('default.html', { root: __dirname + "/public" } );
});
app.use('/main', main);


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = err ;

  res.status(err.status || 500).send(err);
});

module.exports = app;
