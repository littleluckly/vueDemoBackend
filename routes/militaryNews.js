var express = require('express');
var router = express.Router();
var db = require('../utils/db.js')

router.get('/', (req, res, next) => { 
	db.query(`SELECT * FROM militaryNews `,(result)=>{ 
		res.send({data:result}) 
	})
})
module.exports = router;