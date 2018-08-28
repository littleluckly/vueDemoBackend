var express = require('express');
var router = express.Router();
var db = require('../utils/db.js')

router.post('/signIn', (req, res, next) => {
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
		if(result.length>0){
			res.send({status:'err',msg:"当前用户已存在"})
		}else{
			db.query(`INSERT INTO users (username, pass) VALUES ( "${username}", "${pass}")`, function(result){
				res.send({status:'ok'})
			})
		}
	})
})
router.use('/hot', (req, res, next) => {
	const { pageNo, pageSize } = req.body;
	db.query(`SELECT * FROM laugh limit ${pageNo-1}, ${pageSize}`,(result)=>{
		var resData = {
			data: result
		}
		if(result.length>0){
			db.query('SELECT count(*) FROM laugh ', (result2) => { 
				res.send({...resData, total: result2[0]['count(*)']})
			})
		}else{
			res.send({data:[]})
		}
	})
})

module.exports = router;
