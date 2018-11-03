/**
 * @name 数据库操作对象
 * @author 艾欢欢
 * @version 1.1
 * @readonly mysql
 */

 const mysql=require("mysql");

class DBHelper{
    getConn(){
        let conn=mysql.createConnection({
            host:"127.0.0.1",
            port:3306,
            user:"root",
            password:"117079",
            database:'medicines_ms',
            multipleStatements:true        //开启多条Sql语句
        });

        conn.connect();
        return conn;
    }
    
}

module.exports=DBHelper;