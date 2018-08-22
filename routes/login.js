var express = require('express');
var router = express.Router();

router.post('/signIn', function(req, res, next) {
  res.send('登陆成功');
});

module.exports = router;
