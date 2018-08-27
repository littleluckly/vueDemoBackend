var express = require('express');
var homepageRouter = express.Router();
var db = require('../utils/db.js')

homepageRouter.route('/hot').post((req, res, next) => {
	const { pageNo, pageSize } = req.body;
	db.query(`SELECT * FROM laugh limit ${pageNo-1}, ${pageSize}`,(result)=>{
		var resData = {
			data: result
		}
		if(result.length>0){
			db.query('SELECT count(*) FROM laugh ', (result2) => {
				console.log('result22',result2)
				res.send({...resData, total: result2[0]['count(*)']})
			})
		}else{
			res.send({data:[]})
        }

	})
})

module.exports = homepageRouter;