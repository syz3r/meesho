const debug = require('debug')('meesho:invoice');
const http = require('http');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const utils = require('./utils');
const invoiceRouter = require('./services/invoice');
require('dotenv').config()

const invoiceService = express();


// view engine setup
invoiceService.set('views', path.join(__dirname, 'views'));
invoiceService.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//invoiceService.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
invoiceService.use(logger('dev'));
invoiceService.use(bodyParser.json());
invoiceService.use(bodyParser.urlencoded({ extended: false }));
invoiceService.use(cookieParser());
invoiceService.use(express.static(path.join(__dirname, 'public')));

invoiceService.use('/', invoiceRouter);

// catch 404 and forward to error handler
invoiceService.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
invoiceService.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Server stuff
const port = utils.normalizePort(process.env.INVOICE_SERVICE_PORT || '3003');
invoiceService.set('port', port);
var server = http.createServer(invoiceService);
server.listen(port);
server.on('error', utils.onError);
server.on('listening', () => utils.onListening(server,debug));

var kue = require('kue')
  , queue = kue.createQueue();

queue.process('invoice', function(job, done){
  generateInvoice(job, done);
});
var fs = require('fs');
function generateInvoice(job, done) {
  const orderDetail = job.data;
  console.log(`Generating Invoice for order Id ${orderDetail.orderId}, ${orderDetail.title}`);
  setTimeout(()=>{
    fs.writeFile(`${__dirname}/tmp/${orderDetail.orderId}.txt`, JSON.stringify(orderDetail), function(err) {
      if(err) {
        console.log(err);
        done(err);
      } else {
        done();
      }
    })
  },2000)
}