var express = require('express');
var router = express.Router();
var db = require('../utils/db.js')

router.use('/hot', (req, res, next) => {
	const { pageNo, pageSize } = req.body; 
	db.query(`SELECT a.*, SUM(CASE  WHEN b.type = 1 OR b.type = 0 THEN 1 ELSE 0 END) AS allLike, SUM(CASE  WHEN b.type = 1 THEN 1 ELSE 0 END) AS likeCount , SUM(CASE  WHEN b.type = 0 THEN 1 ELSE 0 END) AS dislikeCount FROM laugh a LEFT JOIN laugh_users b ON a.id = b.laugh_id GROUP BY a.id LIMIT ${(pageNo-1)*pageSize}, ${pageSize}`,(result)=>{
		var resData = {
			data: result
		}
		if(result.length>0){
			db.query('SELECT count(*) count FROM laugh ', (result2) => {
				res.send({...resData, total: result2[0]['count']})
			})
		}else{
			res.send({data:[]})
		}
	})
});

router.post('/like', (req,res, next) => {
	const { laughId, type } = req.body;
	const { username } = req.cookies;
	console.log(laughId, type,username )
	// if(type=="like"){ 	
		db.query(`SELECT * from users WHERE userName="${username}"`,(result)=>{
			const userId = result[0].id; 
			db.query(`SELECT * from laugh_users WHERE user_id="${userId}" AND laugh_id="${laughId}"`,(result2)=>{
				if(result2.length===0){
					db.query(`INSERT INTO laugh_users (laugh_id, user_id, type) VALUES ("${laughId}", "${userId}", ${type=="like"?1:0})`,(result3)=>{
						res.send(result3)
					})
				}else{
					res.send({err:'您已经点过赞了！'})
				}
			})  
		}) 
})

module.exports = router;