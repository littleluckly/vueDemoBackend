var express = require('express');
var router = express.Router();
let db = require('../utils/db.js')

router.post('/signIn', function(req, res, next) {
	db.query('SELECT * FROM users WHERE pass="root1" AND username="root"', function (result) {
		if(result&&result.length>0){
			res.send(result);
		}else{
			res.send({msg:"用户名或者密码不对"})
		}
	})
});

module.exports = router;
