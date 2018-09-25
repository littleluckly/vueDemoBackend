var express = require('express');
var router = express.Router();
var db = require('../utils/db.js');
let jwt = require('jsonwebtoken')
//生成token的方法
function generateToken(data){
	  let token = jwt.sign({
		data
	  }, 'secret', { expiresIn: '10s' });
	  return token;
}

router.post('/signIn', (req, res, next) => {
	const { pass, username } = req.body;
	db.query(`SELECT * FROM users WHERE pass="${pass}" AND username="${username}"`, function(result){
		if(result&&result.length>0){
			// var token = jwt.sign({ foo: 'bar' }, { algorithm: 'RS256'});
			let token = generateToken({username})
			res.cookie('username',username)
			res.cookie('auth',username)
			res.cookie('token',token)
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
			res.cookie('username',username)
			res.cookie('auth',username)
			res.send({status:'err',msg:"当前用户已存在"})
		}else{
			db.query(`INSERT INTO users (username, pass) VALUES ( "${username}", "${pass}")`, function(result){
				res.send({status:'ok'})
			})
		}
	})
})

router.get('/logout', (req, res, next) => {
	res.clearCookie('auth');
	res.clearCookie('username')
	res.send('ok')
})

module.exports = router;
