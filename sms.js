const debug = require('debug')('meesho:sms');
const http = require('http');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const utils = require('./utils');
const smsRouter = require('./services/sms');
require('dotenv').config()

const smsService = express();


// view engine setup
smsService.set('views', path.join(__dirname, 'views'));
smsService.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//smsService.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
smsService.use(logger('dev'));
smsService.use(bodyParser.json());
smsService.use(bodyParser.urlencoded({ extended: false }));
smsService.use(cookieParser());
smsService.use(express.static(path.join(__dirname, 'public')));

smsService.use('/', smsRouter);

// catch 404 and forward to error handler
smsService.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
smsService.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Server stuff
const port = utils.normalizePort(process.env.SMS_SERVICE_PORT || '3004');
smsService.set('port', port);
var server = http.createServer(smsService);
server.listen(port);
server.on('error', utils.onError);
server.on('listening', () => utils.onListening(server,debug));
