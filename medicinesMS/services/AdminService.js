/**
 * @name 数据表操作对象
 * @author 艾欢欢
 * @version 1.0
 * @requires BaseService
 * @class AdminService
 */

const BaseService = require("./BaseService"),
    PageList = require("../model/PageList");

class AdminService extends BaseService {
    constructor() {
        super("manger");
    }

    /**
     * @name 根据用户名和密码进行登陆检测
     * @param {Object} paramSql  用户名和密码
     * @returns {Promise} 异步操作
     */
    checkLogin({
        u_id,
        u_password
    }) {
        return new Promise((resolve, reject) => {
            let conn = super.getConn();
            let strSql = `select * from ${this.tableName} where u_id=? and u_password=?`;
            conn.query(strSql, [u_id, u_password], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
            conn.end();
        })
    }


    /**
     * @name 根据openid去查询数据库中是否有该用户信息
     * @param {String} openid 钉钉用户信息的openid
     * @returns {Promise} 异步操作
     */
    findByOpenId(openid) {
        return new Promise((resolve, reject) => {
            let conn = super.getConn();
            let strSql = `select * from ${this.tableName} where openid=? `;
            conn.query(strSql, [openid], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
                conn.end();
            });
        });
    }

    /**
     * @name 绑定老用户操作
     * @param {String} u_id,openid 用户id和钉钉用户信息的openid
     * @returns {Promise} 异步操作
     */
    bindOldUser(u_id,openid){
        return new Promise((resolve,reject)=>{
            let updateSql=`update ${this.tableName} set openid=? where u_id=? `;
            let conn=super.getConn();
            conn.query(updateSql,[openid,u_id],(err,result)=>{
                if(err){
                    reject(err);
                }
                else{
                    let flag=result.affectedRows>0?true:false;
                    resolve(flag);
                }
                conn.end();
            });
        });
    }

    /**
     * @name 绑定新用户操作
     * @param {String} u_id
     * @param {String} openid 用户id和钉钉用户信息的openid
     * @returns {Promise} 异步操作
     */
    bindNewUser(model){
        return new Promise((resolve,reject)=>{
            let conn=super.getConn();
            let {openid,u_id,u_name,u_password}=model;
            let insertSql=super.createInsertSql(model);
            conn.query(insertSql,[openid,u_id,u_name,u_password],(err,result)=>{
                if(err){
                    reject(err);
                }
                else{
                    let flag=result.affectedRows>0?true:false;
                    resolve(flag);
                }
                conn.end();
            });
        });
    }

    /**
     * @name 注册新用户操作
     * @param {String} u_id
     * @param {String} u_name
     * @param {String} u_password
     * @param {String} u_code
     * @returns {Promise} 异步操作
     */
    doRegister(model){
        return new Promise((resolve,reject)=>{
            let conn=super.getConn();
            let {u_id,u_name,u_password}=model;
            let insertSql=super.createInsertSql(model);
            conn.query(insertSql,[u_id,u_name,u_password],(err,result)=>{
                if(err){
                    reject(err);
                }
                else{
                    let flag=result.affectedRows>0?true:false;
                    resolve(flag);
                }
                conn.end();
            });
        });
    }

}

module.exports = AdminService;