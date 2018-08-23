var express = require('express');
var router = express.Router();
var db = require('../utils/db.js')
// import db from '../utils/db'

router.post('/signIn', function(req, res, next) {
	const { pass, username } = req.body;
	db.query(`SELECT * FROM users WHERE pass="${pass}" AND username="${username}"`, function(result){
		if(result&&result.length>0){
			res.send({status:'ok'});
		}else{
			res.send({status:'err',msg:"用户名或者密码不对"})
		}
	})
});

module.exports = router;
