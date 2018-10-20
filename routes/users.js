const express = require('express');
const router = express.Router();
const fs = require('fs');

const db = require('../utils/db.js')
const { getUserId }= require('../utils/helper');

// 获取个人信息
router.post('/fetchUserInfo', async (req,res,next)=>{
  const { username } = req.cookies;
  const userId = await getUserId(username,res);
  if(userId){
    const userInfo = await db.query(`SELECT ui.*,u.username FROM user_info ui LEFT JOIN users u ON u.id=ui.user_id WHERE ui.user_id=${userId};`);
    if(userInfo.length===0){
      await db.query(`INSERT INTO user_info (user_id) VALUES (${userId});`);
      res.send({username,userId});
    }else{
      res.send(userInfo[0]);
    }
  }
})

// 更新个人信息
router.post('/updateUserInfo', async (req,res,next)=>{
  const { username:newusername, email, gender, desc } = req.body;
  const { username } = req.cookies;
  const userId = await getUserId(username,res);
  if(userId){
    const result = await db.query(`UPDATE user_info ui SET ui.email='${email}', ui.desc='${desc}', ui.gender=${gender} WHERE ui.user_id=${userId}`);
    await db.query(`UPDATE users u SET u.username='${newusername}' WHERE u.id=${userId}`);
    res.cookie('username',newusername)
    res.send({status:'ok',msg:'修改成功！'});
  }
});


// 修改头像信息
router.post('/updateUserAvatar', async (req, res, next) => {
  const { avatar } = req.body;
  const { username } = req.cookies;
  const userId = await getUserId(username,res);
  if(userId){
    const userInfo = await db.query(`SELECT ui.* FROM user_info ui WHERE ui.user_id=${userId};`);
    if(userInfo.length===0){
      await db.query(`INSERT INTO user_info (user_id) VALUES (${userId});`);
    }
    const result = await db.query(`UPDATE user_info ui SET ui.avatar='${avatar}' WHERE ui.user_id=${userId}`);
    res.send({status:'ok',msg:'修改成功！'});
  }
});

// 修改密码
router.post('/updateUserPwd', async (req, res, next) => {
  const { newPwd, oriPwd } = req.body;
  const { username } = req.cookies;
  const userInfo = await db.query(`SELECT u.* FROM users u WHERE u.username='${username}'`);
  if(oriPwd!==userInfo[0].pass){
    res.send({status:'fail',msg:'原密码不正确！'})
  }else{
    const result = await db.query(`UPDATE users u SET u.pass='${newPwd}' WHERE u.username='${username}'`);
    res.send(result);
  }
});
module.exports = router;
