var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken')

var db = require('../utils/db.js')
const { getUserId }= require('../utils/helper')

router.use('/hot', async(req, res, next) => {
	const { pageNo, pageSize } = req.body;
	const { username } = req.cookies;
	const userId = await getUserId(username,res);
	if(userId){
		const sql = `SELECT a.*, SUM(CASE  WHEN b.type = 1 OR b.type = 0 THEN 1 ELSE 0 END) AS allLike, SUM(CASE  WHEN b.type = 1 THEN 1 ELSE 0 END) AS likeCount , SUM(CASE  WHEN b.type = 0 THEN 1 ELSE 0 END) AS dislikeCount , IFNULL(( SELECT c.type FROM laugh_users c WHERE c.user_id = ${userId} AND c.laugh_id = a.id ), -1) AS likeType FROM laugh a LEFT JOIN laugh_users b ON a.id = b.laugh_id GROUP BY a.id LIMIT ${(pageNo-1)*pageSize}, ${pageSize}`;
		const result2 = await db.query(sql);
		const result3 = await db.query('SELECT count(*) count FROM laugh');
		res.send({data:result2, total: result3[0]['count']})
	}
});

// 点赞点踩
router.post('/like', async (req,res, next) => {
	const { laughId, type, likeType } = req.body;
	const { username } = req.cookies;
	const userId = await getUserId(username,res);
	if(userId){
		let sql = ''
		let val = null;
		if(likeType===1){
			val = type==="like"?null:0;
			sql = `UPDATE laugh_users b SET b.type=${val} WHERE b.laugh_id=${laughId} AND b.user_id=${userId}; `
		}else if( likeType===0 ){
			val = type==="dislike"?null:1;
			sql = `UPDATE laugh_users b SET b.type=${val} WHERE b.laugh_id=${laughId} AND b.user_id=${userId}; `
		}else{
			const result = await db.query(`SELECT * from laugh_users l WHERE l.user_id=${userId} AND l.laugh_id=${laughId}`)
			if(result.length>0){
				val = type==="dislike"?0:1;
				sql = `UPDATE laugh_users b SET b.type=${val} WHERE b.laugh_id=${laughId} AND b.user_id=${userId}; `
				const result2 = await db.query(sql)
				res.send({status:'ok'})
			}else{
				sql = `INSERT INTO laugh_users (laugh_id, user_id, type) VALUES ("${laughId}", "${userId}", ${type=="like"?1:0})`
				const result3 = await db.query(sql)
				res.send({status:'ok'})
			}
			return;
		}
		await db.query(sql);
		res.send({status:'ok'})
	} 
})

// 发表评论
router.post('/comment', async (req, res, next) => {
	const { content, laughId } = req.body;
	const { username } = req.cookies;
	const userId = await getUserId(username,res);
	if(userId){
		const result = await db.query(`INSERT INTO laugh_user_comment (laugh_id, user_id, content, create_time)
			VALUES (${laughId}, ${userId}, "${content}", NOW() )`);
		res.send({status:'ok',msg:result})
	}
})

// 获取评论列表
router.post('/getCommentList', async (req, res, next) => {
	const { laughId } = req.body;
	const result = await db.query(`select lus.*,u.username  from
	(SELECT * from laugh_user_comment lu where lu.laugh_id=${laughId}) lus
	left join  users u
	on lus.user_id=u.id
	ORDER BY lus.create_time DESC`);
	res.send(result)
})

module.exports = router;