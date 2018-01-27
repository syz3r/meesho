const debug = require('debug')('meesho:mail');
const http = require('http');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const utils = require('./utils');
const mailRouter = require('./services/mail');
require('dotenv').config()

const mailService = express();


// view engine setup
mailService.set('views', path.join(__dirname, 'views'));
mailService.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//mailService.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
mailService.use(logger('dev'));
mailService.use(bodyParser.json());
mailService.use(bodyParser.urlencoded({ extended: false }));
mailService.use(cookieParser());
mailService.use(express.static(path.join(__dirname, 'public')));

mailService.use('/', mailRouter);

// catch 404 and forward to error handler
mailService.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
mailService.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Server stuff
const port = utils.normalizePort(process.env.MAIL_SERVICE_PORT || '3002');
mailService.set('port', port);
var server = http.createServer(mailService);
server.listen(port);
server.on('error', utils.onError);
server.on('listening', () => utils.onListening(server,debug));

// kue

var kue = require('kue')
  , queue = kue.createQueue();

queue.process('mail', function(job, done){
  sendMail(job, done);
});

const fs = require('fs');
function sendMail(job, done) {
  const orderDetail = job.data;
  const path = `${__dirname}/tmp/${orderDetail.orderId}.txt`;
  if(fs.existsSync(path)){
    console.log(`Email with attachment sent to ${orderDetail.buyerName} on ${orderDetail.buyerEmail} for order Id ${orderDetail.orderId}, ${orderDetail.title}`);
    done();
  } else {
    if(!job._attempts){
      console.log(`Email without attachment sent to ${orderDetail.buyerName} on ${orderDetail.buyerEmail} for order Id ${orderDetail.orderId}, ${orderDetail.title}`);
    }
    return done(new Error('invoice not generated'));
  }
}
