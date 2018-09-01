var express = require('express');
var router = express.Router();
var db = require('../utils/db.js')

router.use('/hot', (req, res, next) => {
	const { pageNo, pageSize } = req.body;
	db.query(`SELECT * FROM laugh limit ${(pageNo-1)*pageSize}, ${pageSize}`,(result)=>{
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
});

router.post('/like', (req,res, next) => {
	const { laughId, type } = req.body;
	const { username } = req.cookies;
	if(type==="like"){
		// SELECT a.id, a.authorName, COUNT(*) AS num, b.type FROM laugh a LEFT JOIN laugh_users b ON b.laugh_id = a.id WHERE a.id = 2755 AND b.type = 1	
		db.query(`SELECT * from users WHERE username=${username}`,(result)=>{
			const userId = result[0].id;
			db.query(`SELECT * from laugh_users WHERE user_id=${userId} AND laugh_id=${laughId}`,(result2)=>{
				if(result2.length===0){
					db.query(`INSERT INTO laugh_users (laugh_id, user_id, type) VALUES ('${laughId}', '${userId}', '${type=="like"?1:0}')`,(result3)=>{
						res.send(result3)
					})
				}else{
					res.send({})
				}
			})
		})
	}else if(type==="dislike"){
		db.query(`UPDATE laugh SET dislikeCount=dislikeCount+1 WHERE id=${laughId}`, (result)=>{
			res.send(result);
		})
	}
})

module.exports = router;