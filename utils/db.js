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
        }
        return;
    });
    if(!sql){
        return;
    }
    connection.query(sql, function (err, rows, fields) {
        if(err){return;}
        fallback(rows)
    });
    connection.end(function (err) {
        if(err){
            return ;
        }else{
            console.log('关闭连接')
        }
     })

}
module.exports=db;
