var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken')

var db = require('../utils/db.js')
const { getUserId }= require('../utils/helper')

router.use('/hot', (req, res, next) => {
	const { pageNo, pageSize } = req.body;
	const { username } = req.cookies;
	db.query(`SELECT * from users WHERE userName="${username}"`).
		then((userId)=>
			db.query(`SELECT a.*, SUM(CASE  WHEN b.type = 1 OR b.type = 0 THEN 1 ELSE 0 END) AS allLike, SUM(CASE  WHEN b.type = 1 THEN 1 ELSE 0 END) AS likeCount , SUM(CASE  WHEN b.type = 0 THEN 1 ELSE 0 END) AS dislikeCount , IFNULL(( SELECT c.type FROM laugh_users c WHERE c.user_id = '${userId}' AND c.laugh_id = a.id ), -1) AS likeType FROM laugh a LEFT JOIN laugh_users b ON a.id = b.laugh_id GROUP BY a.id LIMIT ${(pageNo-1)*pageSize}, ${pageSize}`)).
		then(result=>{
			var resData = {
				data: result
			}
			if(result.length>0){
				console.log('2222222',result[0])
				// db.query('SELECT count(*) count FROM laugh')
				res.send({...resData, total: result2[0]['count']})
			}else{
				res.send({data:[]})
			}
	}).catch(err=>{
		res.send({msg:'登陆信息有误'})
	})

	// getUserId(username).then((userId)=>{
	// 	db.query(`SELECT a.*, SUM(CASE  WHEN b.type = 1 OR b.type = 0 THEN 1 ELSE 0 END) AS allLike, SUM(CASE  WHEN b.type = 1 THEN 1 ELSE 0 END) AS likeCount , SUM(CASE  WHEN b.type = 0 THEN 1 ELSE 0 END) AS dislikeCount , IFNULL(( SELECT c.type FROM laugh_users c WHERE c.user_id = '${userId}' AND c.laugh_id = a.id ), -1) AS likeType FROM laugh a LEFT JOIN laugh_users b ON a.id = b.laugh_id GROUP BY a.id LIMIT ${(pageNo-1)*pageSize}, ${pageSize}`,(result)=>{
	// 		var resData = {
	// 			data: result
	// 		}
	// 		if(result.length>0){
	// 			db.query('SELECT count(*) count FROM laugh ', (result2) => {
	// 				res.send({...resData, total: result2[0]['count']})
	// 			})
	// 		}else{
	// 			res.send({data:[]})
	// 		}
	// 	})
	// }).catch(()=>res.send({msg:'登陆信息有误'}))



		// db.query(`SELECT * from users WHERE userName="${username}"`,(result)=>{
		// 	const userId = result[0].id;
		// 	db.query(`SELECT a.*, SUM(CASE  WHEN b.type = 1 OR b.type = 0 THEN 1 ELSE 0 END) AS allLike, SUM(CASE  WHEN b.type = 1 THEN 1 ELSE 0 END) AS likeCount , SUM(CASE  WHEN b.type = 0 THEN 1 ELSE 0 END) AS dislikeCount , IFNULL(( SELECT c.type FROM laugh_users c WHERE c.user_id = '${userId}' AND c.laugh_id = a.id ), -1) AS likeType FROM laugh a LEFT JOIN laugh_users b ON a.id = b.laugh_id GROUP BY a.id LIMIT ${(pageNo-1)*pageSize}, ${pageSize}`,(result)=>{
		// 			var resData = {
		// 				data: result
		// 			}
		// 			if(result.length>0){
		// 				db.query('SELECT count(*) count FROM laugh ', (result2) => {
		// 					res.send({...resData, total: result2[0]['count']})
		// 				})
		// 			}else{
		// 				res.send({data:[]})
		// 			}
		// 	})
		// })

});

// 点赞点踩
router.post('/like', (req,res, next) => {
	const { laughId, type, likeType } = req.body;
	const { username } = req.cookies;
	db.query(`SELECT * from users WHERE userName="${username}"`,(result)=>{
		const userId = result[0].id;
		let sql = ''
		let val = null;
		if(likeType===1){
			val = type==="like"?null:0;
			sql = `UPDATE laugh_users b SET b.type=${val} WHERE b.laugh_id=${laughId} AND b.user_id=${userId}; `
		}else if( likeType===0 ){
			val = type==="dislike"?null:1;
			sql = `UPDATE laugh_users b SET b.type=${val} WHERE b.laugh_id=${laughId} AND b.user_id=${userId}; `
		}else{
			db.query(`SELECT * from laugh_users l WHERE l.user_id=${userId} AND l.laugh_id=${laughId}`,(result2)=>{
				if(result2.length>0){
					val = type==="dislike"?0:1;
					sql = `UPDATE laugh_users b SET b.type=${val} WHERE b.laugh_id=${laughId} AND b.user_id=${userId}; `
					db.query(sql,(result4)=>{
						res.send(result4)
					})
				}else{
					sql = `INSERT INTO laugh_users (laugh_id, user_id, type) VALUES ("${laughId}", "${userId}", ${type=="like"?1:0})`
					db.query(sql,(result5)=>{
						res.send(result5)
					})
				}
			})
			return;
			// sql = `INSERT INTO laugh_users (laugh_id, user_id, type) VALUES ("${laughId}", "${userId}", ${type=="like"?1:0})`
		}
		// sql = `UPDATE laugh_users b SET b.type=${val} WHERE b.laugh_id=${laughId} AND b.user_id=${userId}; `
		db.query(sql,(result6)=>{
			res.send(result6)
		})
	})
})

// 发表评论
router.post('/comment', (req, res, next) => {
	const { content, laughId } = req.body;
	const { username } = req.cookies;
	db.query(`SELECT * from users WHERE userName="${username}"`,(result)=>{
		const userId = result[0].id;
		db.query(`INSERT INTO laugh_user_comment (laugh_id, user_id, content, create_time)
		VALUES (${laughId}, ${userId}, "${content}", NOW() )`,(result3)=>{
			res.send({status:'ok',msg:''})
		})
	})
})

// 获取评论列表
router.post('/getCommentList', (req, res, next) => {
	const { laughId } = req.body;
	db.query(`select lus.*,u.username  from
		(SELECT * from laugh_user_comment lu where lu.laugh_id=${laughId}) lus
		left join  users u
		on lus.user_id=u.id
		ORDER BY lus.create_time DESC`,(result3)=>{
		res.send(result3)
	})
})

module.exports = router;