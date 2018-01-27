const express = require('express');
const router = express.Router();
const kue = require('kue');
const queue = kue.createQueue();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Order Service' });
});

router.post('/order', (req, res, next) => {
  const orderDetails = req.body;
  queue.create('invoice',orderDetails).attempts(3).backoff( {type:'exponential'} ).removeOnComplete(true).save();
  queue.create('mail',orderDetails).delay(1000).attempts(3).backoff( {type:'exponential'} ).removeOnComplete(true).save();
  queue.create('sms',orderDetails).attempts(3).backoff( {type:'exponential'} ).removeOnComplete(true).save();

  res.status(200).json({message:"Order processed successfully!"});
});

module.exports = router;
