const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');//引入multer
const upload = multer({dest: 'public/uploads/userCenter/'});//设置上传文件存储地址

const db = require('../utils/db.js')
const { getUserId }= require('../utils/helper');

// 上传文件
router.post('/uploadFile', upload.single('file'), (req, res, next) => {
    var file = req.file;
    // console.log('file',file,res.url,req.url)
    if (file) {
        var fileNameArr = file.originalname.split('.');
        var suffix = fileNameArr[fileNameArr.length - 1];
        //文件重命名
        fs.renameSync(`./public/uploads/userCenter/${file.filename}`, `./public/uploads/userCenter/${file.filename}.${suffix}`);
        file['newfilename'] = `${file.filename}.${suffix}`;
    }
    res.send({status:'ok',file,host:'http://127.0.0.1:5577/',src:`uploads/userCenter/${file.filename}.${suffix}`});
});

// 删除
router.post('/uploadFile', upload.single('file'), (req, res, next) => {
    var file = req.file;
    // console.log('file',file,res)
    if (file) {
        var fileNameArr = file.originalname.split('.');
        var suffix = fileNameArr[fileNameArr.length - 1];
        //文件重命名
        fs.renameSync(`./public/uploads/userCenter/${file.filename}`, `./public/uploads/userCenter/${file.filename}.${suffix}`);
        file['newfilename'] = `${file.filename}.${suffix}`;
    }
    res.send({status:'ok',file,src:`http:${res.headers.host}/uploads/userCenter/${file.filename}.${suffix}`});
});

module.exports = router;
