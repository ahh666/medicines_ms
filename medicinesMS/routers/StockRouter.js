/**
 * @name 数据库的路由操作(药品库存)
 * @author 艾欢欢
 * @version 1.0
 * @description 路由
 */

const express = require("express"),
    StockService = require("../services/StockService"),
    MessageBox = require("../utils/MessageBox"),
    MedicinesList = require("../model/MedicinesList"),
    PageJson = require("../model/PageJson");

let router = express.Router();

//药品库存信息列表
router.get("/stockList", async (req, resp) => {
    let stockService = new StockService();
    let pageIndex = req.query.pageIndex || 1;
    try {
        let pageList = await stockService.queryByList(req.query, pageIndex);
        resp.render("stock/stockList", pageList);
    } catch (error) {
        resp.send("服务器错误");
        console.log(error);
    }
});

//根据条件查询
router.get("/queryByList", async (req, resp) => {
    //在这里得到了后面提交过来的参数
    //根据这三个参数到后台去查询
    let stockService = new StockService();
    let pageIndex = req.query.pageIndex || 1;
    try {
        let pageList = await stockService.queryByList(req.query, pageIndex);
        resp.render("stock/stockList", pageList);
    } catch (error) {
        resp.send("服务器错误");
        console.log(error);
    }
});

//添加药信息
router.get("/addMedicines",(req,resp)=>{
    let medicinesList=new MedicinesList();
    let objArr=Array.from(Object.entries(medicinesList));
    resp.render("Stock/addMedicines",{objArr:objArr});
});

//点击确认后，执行添加药品信息
router.post("/doAddMedicines", async (req, resp) => {
    //get取值的时候找req.query
    //post取值找req.body
    //默认情况下，Express不支持post取值，需要使用第三方插件（包）
    //yarn add body-parser
    let stockService = new StockService();
    try {
        let result = await stockService.addMedicines(req.body);
        if (result.affectedRows > 0) {
            MessageBox.showAndRedirect("新增成功", "/Stock/stockList", resp);
        } else {
            MessageBox.showAndBack("新增失败", resp);
        }
    } catch (error) {
        MessageBox.showAndBack("服务器错误", resp);
    }
});


//通过ID删除药品信息，Ajax请求
router.get("/deleteById", async (req, resp) => {
    let { m_id } = req.query;
    try {
        let stockService = new StockService();
        let flag = await stockService.deleteById(m_id);
        if (flag) {
            //说明删除成功
            let pageJson = new PageJson("success", "删除成功");
            let jsonStr = JSON.stringify(pageJson);
            resp.send(jsonStr);
        } else {
            //删除失败
            let pageJson = new PageJson("error", "删除失败");
            let jsonStr = JSON.stringify(pageJson);
            resp.send(jsonStr);

        }
    } catch (error) {
        //服务器错误
        let pageJson = new PageJson("error", "服务器错误");
        let jsonStr = JSON.stringify(pageJson);
        resp.send(jsonStr);
    }
});

//选除选中项（批量删除）
router.get("/deleteByChecked", async (req, resp) => {
    let { m_idArr } = req.query;
    let arr = m_idArr.split("-"); //根据指定的符号去分隔字成串，把它分成一个数组 
    try {
        let stockService = new StockService();
        let flag = await stockService.deleteByChecked(arr);
        if (flag) {
            //说明删除成功
            let pageJson = new PageJson("success", "删除成功");
            // let jsonStr=JSON.stringify(pageJson);
            // resp.send(jsonStr);
            resp.json(pageJson);
        } else {
            //删除失败
            let pageJson = new PageJson("error", "删除失败"); //对象
            //let jsonStr=JSON.stringify(pageJson);    //将JS对象转成JSON字符串
            //resp.send(jsonStr);  //发送一个字符串
            //Express可以直接将一个对象以JSON形式传递到前台
            resp.json(pageJson); //直接以对象的形式传递   前台接收到的时候，就不用再进行转换了，得到的，也是一个对象

        }
    } catch (error) {
        //服务器错误
        console.log(error);
        let pageJson = new PageJson("error", "服务器错误");
        // let jsonStr=JSON.stringify(pageJson);
        // resp.send(jsonStr);
        resp.json(pageJson);
    }
});


//编辑药品信息
router.get("/editMedicines", async (req, resp) => {
    let { m_id } = req.query; //根据药品编号取得数据库的信息
    try {
        let stockService = new StockService();
        let result = await stockService.findByM_id(m_id);
        if (result.length == 1) {
            resp.render("stock/editMedicines", {
                model: result[0]
            });
        } else {
            MessageBox.showAndBack("当前信息不存在，请刷新重试", resp);
        }
    } catch (error) {
        MessageBox.showAndBack("服务器错误", resp);
    }
});


router.post("/doEditMedicines", async (req, resp) => {
    try {
        let stockService = new StockService();
        let flag = await stockService.editMedicines(req.body);
        if (flag) {
            //修改成功
            MessageBox.showAndRedirect("修改成功", "/Stock/stockList", resp);
        } else {
            //修改失败
            MessageBox.showAndBack("修改失败，请重试或联系管理员", resp);
        }
    } catch (error) {
        MessageBox.showAndBack("服务器错误", resp);
    }
});

//库存紧张药品
router.get("/stockTips", async (req,resp)=>{
    let stockService = new StockService();
    let pageIndex = req.query.pageIndex || 1;    
    try {
        let pageList = await stockService.queryByM_number(pageIndex);
        resp.render("stock/stockList", pageList);
    } catch (error) {
        resp.send("服务器错误");
        console.log(error);
    }
    
});




module.exports = router;