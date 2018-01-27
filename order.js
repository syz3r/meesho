const debug = require('debug')('meesho:order');
const http = require('http');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const utils = require('./utils');
const orderRouter = require('./services/order');
require('dotenv').config()

const orderService = express();


// view engine setup
orderService.set('views', path.join(__dirname, 'views'));
orderService.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//orderService.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
orderService.use(logger('dev'));
orderService.use(bodyParser.json());
orderService.use(bodyParser.urlencoded({ extended: false }));
orderService.use(cookieParser());
orderService.use(express.static(path.join(__dirname, 'public')));

orderService.use('/', orderRouter);

// catch 404 and forward to error handler
orderService.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
orderService.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Server stuff
const port = utils.normalizePort(process.env.ORDER_SERVICE_PORT || '3001');
orderService.set('port', port);
var server = http.createServer(orderService);
server.listen(port);
server.on('error', ()=> utils.onError(port));
server.on('listening', () => utils.onListening(server,debug));
