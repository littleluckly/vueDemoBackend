const db = require('./db.js')
const getUserId = async (username,res)=>{
    const result = await db.query(`SELECT * from users WHERE userName="${username}"`)
    if(result.length>0){
        return result[0].id
    }else{
        res.send({msg:'登陆信息有误'})
    }
}

module.exports = {
    getUserId
}