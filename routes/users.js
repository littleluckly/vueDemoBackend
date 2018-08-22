var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/center', function(req, res, next) {
  res.send('用户中心');
});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/center', function(req, res, next) {
  console.log(req)
  res.send('post用户中心');
});

module.exports = router;
