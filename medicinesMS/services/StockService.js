/**
 * @name 数据表操作对象
 * @author 艾欢欢
 * @version 2.0
 * @requires BaseService
 * @class StockService
 * @description 1.0版本 增加Promise，实现继承 添加分页
 */

const BaseService = require("./BaseService"),
        ObjectHelper = require("../utils/ObjectHelper"),
        PageList = require("../model/PageList");


class StockService extends BaseService {
    constructor() {
        super("stock","manger");    //实现继承以后，一定要调用super

    }
   

    /**
     * @name 获取所有药品信息
     * @returns {Promise} 异步操作
     */
    // getAllList() {
    //     return new Promise((resolve, reject) => {
    //         let conn = super.getConn();
    //         conn.query(`select * from ${this.tableName}`, [], (err, result) => {
    //             if (err) {
    //                 reject(err);
    //             }
    //             else {
    //                 resolve(result);
    //             }
    //         });
    //         conn.end();
    //     });
    // }


    /**
     * @name 根据参数查询信息，并进行分页
     * @param {*} paramSql 要查询的参数
     * @param {Number} pageIndex 分页的页码
     * @returns {Promise} 返回查询以后的Promise 
     */
    queryByList({ m_id, m_name }, pageIndex) {
        return new Promise((resolve, reject) => {
            let conn = super.getConn();
            let strSql = `select * from ${this.tableName} where 1=1 `;                    //查询的Sql
            let strCountSql = `select count(*)  'sumCount' from ${this.tableName} where 1=1 `;       //计数的Sql
            let paramSql = "";       //查询参数                                             
            //如果一旦涉及到条件拼接，那么，则需要使用一种固定的格式
            if (!ObjectHelper.isNullOrUndefined(m_id)) {
                paramSql += ` and m_id like "%${m_id}%" `;
            }
            if (!ObjectHelper.isNullOrUndefined(m_name)) {
                paramSql += ` and m_name like "%${m_name}%" `;
            }
            strSql += paramSql + " limit ?,? "              //拼接分页的Sql
            strCountSql += paramSql;                      //拼接计数的Sql
            conn.query(strSql + ";" + strCountSql, [(pageIndex - 1) * 10, 10], (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    // resolve(result);
                    //这一个地方的result是一个分页信息和总条数的结果
                    //现在，要根据这个结果，来计算出一共分了多少页，并且把这个结果返回到页面去
                    let sumCount = result[1][0].sumCount;
                    let pageList = new PageList(pageIndex, sumCount, result[0]);
                    resolve(pageList);    //返回的一个分页信息的对象
                }
                conn.end();
            });
        });
    }

     /**
     * @name 根据m_number查询库存过低（低于10）的药品信息，分页
     * @param {*} paramSql 要查询的参数
     * @param {Number} pageIndex 分页的页码
     * @returns {Promise} 返回查询以后的Promise 
     */
    queryByM_number( pageIndex) {
        return new Promise((resolve, reject) => {
            let conn = super.getConn();
            let strSql = `select * from ${this.tableName} where m_number<10 limit ?,?`;                    //查询的Sql
            let strCountSql = `select count(*)  'sumCount' from ${this.tableName} where m_number<10 `;       //计数的Sql
            conn.query(strSql + ";" + strCountSql, [(pageIndex - 1) * 10, 10], (err, result) => {
                if (err) {
                    reject(err);
                }
                else { 
                    let sumCount = result[1][0].sumCount;
                    let pageList = new PageList(pageIndex, sumCount, result[0]);
                    resolve(pageList);    //返回的一个分页信息的对象
                }
                conn.end();
            });
        });
    }
    
   
    /**
     * @name 添加药品信息
     * @param {MedicinesList} model 
     * @returns {Promise} 返回操作结果
     */
    addMedicines(model) {
        return new Promise((resolve, reject) => {
            let values = Object.values(model);
            let conn = super.getConn();
            let insertSql = super.createInsertSql(model);
            conn.query(insertSql, values, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
                conn.end();
            });
        })
    }
    
 

    /**
     * @name 根据药品编号删除信息
     * @param {String} m_id 删除时，依据的药品编号 
     * @returns {Promise} 返回数据库操作结果Promise
     */
    deleteById(m_id) {
        return new Promise((resolve, reject) => {
            let conn = super.getConn();
            let deleteSql = `delete from ${this.tableName} where m_id=? `;
            conn.query(deleteSql, [m_id], (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    //根据受影响的行，判定是否删除成功
                    let flag = result.affectedRows > 0 ? true : false;
                    resolve(flag);
                }
                conn.end();
            });
        })
    }

    /**
     * @name 批量删除
     * @param {Array} m_idArr 删除时，依据的药品编号的数组 
     * @returns {Promise}  返回执行数据库以后的操作
     */
    deleteByChecked(m_idArr) {
        return new Promise((resolve, reject) => {
            let conn=super.getConn();
            let deleteSql=`delete from ${this.tableName} where m_id in (${new Array(m_idArr.length).fill("?").toString()})`;
            conn.query(deleteSql,m_idArr,(err,result)=>{
                if(err){
                    reject(err);
                }
                else{
                    //根据受影响的行，判定是否删除成功
                    let flag=result.affectedRows>0?true:false;
                    resolve(flag);
                }
            });
            conn.end();
        });
    }


    /**
     * @name 根据药品编号得到药品信息
     * @param {String} m_id 药品编号 
     * @returns {Promise}  返回执行数据库以后的操作 
     */
    findByM_id(m_id){
        return new Promise((resolve,reject)=>{
            let conn=super.getConn();
            let strSql=`select * from ${this.tableName} where m_id=? `;
            conn.query(strSql,[m_id],(err,result)=>{
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
                conn.end();
            });
        });
    }

    /**
     * @name 修改药品信息
     * @param {Object} model 要修改的对象 
     * @returns {Promise}  返回执行数据库以后的操作
     */
    editMedicines(model){
        return new Promise((resolve,reject)=>{
            let {m_id,m_name,m_lotnum,m_number,m_unit,m_bit,m_sell,a_id}=model;
            let updateSql=`update ${this.tableName} set m_name=?,m_lotnum=?,m_number=?,m_unit=?,m_bit=?,m_sell=?,a_id=? where m_id=?`;
            let conn=super.getConn();
            conn.query(updateSql,[m_name,m_lotnum,m_number,m_unit,m_bit,m_sell,a_id,m_id],(err,result)=>{
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


module.exports = StockService;