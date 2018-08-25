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

router.post('/signUp', function(req, res, next){
	const { pass, username } = req.body;
	db.query(`SELECT * FROM users WHERE username="${username}"`, (result)=>{
		console.log(result)
		if(result.length>0){
			res.send({status:'err',msg:"当前用户已存在"})
		}else{
			db.query(`INSERT INTO users (username, pass) VALUES ( "${username}", "${pass}")`, function(result){
				res.send({status:'ok'})
			})
		}
	})
})

module.exports = router;
