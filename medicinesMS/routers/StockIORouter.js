/**
 * @name 数据库的路由操作（药品进出库）
 * @author 艾欢欢
 * @version 1.0
 * @description 路由
 */

const express = require("express"),
    StockInService = require("../services/StockInService"),
    StockOutService = require("../services/StockOutService"),
    SrockInList = require("../model/StockInList"),
    SrockOutList = require("../model/StockOutList"),
    MessageBox =require("../utils/MessageBox"),
    PageJson = require("../model/PageJson");

let router = express.Router();

//药品入库信息列表
router.get("/stockInList", async (req, resp) => {
    let stockInService = new StockInService();
    let pageIndex = req.query.pageIndex || 1;
    try {
        let pageList = await stockInService.in_queryByList(req.query, pageIndex);
        resp.render("stock_IO/stockInList", pageList);
    } catch (error) {
        resp.send("服务器错误");
        console.log(error);
    }
});

//根据条件查询入库信息
router.get("/in_queryByList", async (req, resp) => {
    //在这里得到了后面提交过来的参数
    //根据这三个参数到后台去查询
    let stockService = new StockInService();
    let pageIndex = req.query.pageIndex || 1;
    try {
        let pageList = await stockService.in_queryByList(req.query, pageIndex);
        resp.render("stock_IO/stockInList", pageList);
    } catch (error) {
        resp.send("服务器错误");
        console.log(error);
    }
});

//药品出库库信息列表
router.get("/stockOutList", async (req, resp) => {
    let stockOutService = new StockOutService();
    let pageIndex = req.query.pageIndex || 1;
    try {
        let pageList = await stockOutService.out_queryByList(req.query, pageIndex);
        resp.render("stock_IO/stockOutList", pageList);
    } catch (error) {
        resp.send("服务器错误");
        console.log(error);
    }
});

//根据条件查询出库信息
router.get("/out_queryByList", async (req, resp) => {
    //在这里得到了后面提交过来的参数
    //根据这三个参数到后台去查询
    let stockOutService = new StockOutService();
    let pageIndex = req.query.pageIndex || 1;
    try {
        let pageList = await stockOutService.out_queryByList(req.query, pageIndex);
        resp.render("stock_IO/stockOutList", pageList);
    } catch (error) {
        resp.send("服务器错误");
        console.log(error);
    }
});

//药品入库操作
router.get("/stockIn",(req,resp)=>{
    let srockInList=new SrockInList();
    let objArr=Array.from(Object.entries(srockInList));
    resp.render("Stock_IO/stockIn",{objArr:objArr});
});

//点击确认后，执行药品入库操作
router.post("/doStockIn", async (req, resp) => {

    let stockInService = new StockInService();
    try {
        let result = await stockInService.stockIn(req.body);
        if (result.affectedRows > 0) {
            MessageBox.showAndRedirect("新增成功", "/Stock_IO/stockInList", resp);
        } else {
            MessageBox.showAndBack("新增失败", resp);
        }
    } catch (error) {
        MessageBox.showAndBack("服务器错误", resp);
    }
});

//药品出库操作
router.get("/stockOut",(req,resp)=>{
    let srockOutList=new SrockOutList();
    let objArr=Array.from(Object.entries(srockOutList));
    resp.render("Stock_IO/stockOut",{objArr:objArr});
});

//点击确认后，执行药品出库操作
router.post("/doStockOut", async (req, resp) => {

    let stockOutService = new StockOutService();
    try {
        let result = await stockOutService.stockOut(req.body);
        if (result.affectedRows > 0) {
            MessageBox.showAndRedirect("新增成功", "/Stock_IO/stockOutList", resp);
        } else {
            MessageBox.showAndBack("新增失败", resp);
        }
    } catch (error) {
        MessageBox.showAndBack("服务器错误", resp);
    }
});

module.exports = router;