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

// 点赞点踩
router.post('/like', (req,res, next) => {
	const { laughId, type } = req.body;
	const { username } = req.cookies;
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

// 发表评论
router.post('/comment', (req, res, next) => {
	const { content, laughId } = req.body;
	const { username } = req.cookies;
	db.query(`SELECT * from users WHERE userName="${username}"`,(result)=>{
		const userId = result[0].id;
		console.log(userId,'userId')
		db.query(`INSERT INTO laugh_user_comment (laugh_id, user_id, content, create_time)
		VALUES (${laughId}, ${userId}, "${content}", NOW() )`,(result3)=>{
			res.send({status:'ok',msg:''})
		})
	})
})

// 获取评论列表
router.post('/getCommentList', (req, res, next) => {
	const { laughId } = req.body;
	console.log('laughId',laughId)
	db.query(`select lus.*,u.username  from
		(SELECT * from laugh_user_comment lu where lu.laugh_id=${laughId}) lus
		left join  users u
		on lus.user_id=u.id
		ORDER BY lus.create_time DESC`,(result3)=>{
		res.send(result3)
	})
})

module.exports = router;