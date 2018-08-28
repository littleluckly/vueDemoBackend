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
})
module.exports = router;