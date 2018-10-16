let mysql = require('mysql');
let db={};
db.query = function(sql,fallback){
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '123456',
        database : 'vuedemo'
    });
    connection.connect(function(err){
        if(err){
            conosle.log(err)
        }else{
            console.log('数据库连接成功')
        }
        return;
    });
    if(!sql){
        return;
    }
    return new Promise((resolve, reject)=>{
        connection.query(sql, function (err, rows, fields) {
            if(err){return;}
            if(Object.prototype.toString.call(rows)==="[object Object]"){
                resolve({status: rows.affectedRows===0?'fail':'ok'})
            }else{
                console.log(rows)
                resolve(rows)
            }

            // fallback(rows)
        });
        connection.end(function (err) {
            if(err){
                return ;
            }else{
                console.log('关闭连接')
            }
         })
    })
    // connection.query(sql, function (err, rows, fields) {
    //     // if(err){return;}
    //     console.log('rowsssssss',rows)
    //     return new Promise((resolve,reject)=>{
    //         resolve(rows)
    //     })
    //     // fallback(rows)
    // });
    // connection.end(function (err) {
    //     if(err){
    //         return ;
    //     }else{
    //         console.log('关闭连接')
    //     }
    //  })

}
module.exports=db;
// export default db;
