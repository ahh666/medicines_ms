/**
 * @name 数据表操作对象
 * @author 艾欢欢
 * @version 2.0
 * @requires BaseService
 * @class StockInService
 */

const BaseService = require("./BaseService"),
        ObjectHelper = require("../utils/ObjectHelper"),
        PageList = require("../model/PageList");


class StockInService extends BaseService {
    constructor() {
        super("stock_in");
    }

    /**
     * @name 根据参数查询信息，并进行分页
     * @param {*} paramSql 要查询的参数
     * @param {Number} pageIndex 分页的页码
     * @returns {Promise} 返回查询以后的Promise 
     */
    in_queryByList({
        m_id,
        m_name
    }, pageIndex) {
        return new Promise((resolve, reject) => {
            let conn = super.getConn();
            let strSql = `select * from ${this.tableName} where 1=1 `; //查询的Sql
            let strCountSql = `select count(*)  'sumCount' from ${this.tableName} where 1=1 `; //计数的Sql
            let paramSql = ""; //查询参数                                             
            //如果一旦涉及到条件拼接，那么，则需要使用一种固定的格式
            if (!ObjectHelper.isNullOrUndefined(m_id)) {
                paramSql += ` and m_id like "%${m_id}%" `;
            }
            if (!ObjectHelper.isNullOrUndefined(m_name)) {
                paramSql += ` and m_name like "%${m_name}%" `;
            }
            strSql += paramSql + " limit ?,? " //拼接分页的Sql
            strCountSql += paramSql; //拼接计数的Sql
            conn.query(strSql + ";" + strCountSql, [(pageIndex - 1) * 10, 10], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    // resolve(result);
                    //这一个地方的result是一个分页信息和总条数的结果
                    //现在，要根据这个结果，来计算出一共分了多少页，并且把这个结果返回到页面去
                    let sumCount = result[1][0].sumCount;
                    let pageList = new PageList(pageIndex, sumCount, result[0]);
                    resolve(pageList); //返回的一个分页信息的对象
                }
                conn.end();
            });
        });
    }

     /**
     * @name 药品入库
     * @param {MedicinesList} model 
     * @returns {Promise} 返回操作结果
     */
    stockIn(model) {
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
     

}

module.exports = StockInService;