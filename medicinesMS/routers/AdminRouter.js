/**
 * @name 数据表操作对象
 * @author 艾欢欢
 * @version 1.0
 * @requires BaseService
 */

const express = require("express"),
    AdminService = require("../services/AdminService"),
    MessageBox = require("../utils/MessageBox"),
    PageJson = require("../model/PageJson"),
    RegisterList = require("../model/RegisterList"),
    menuConfig = require("../config/menuConfig"),
    DingHelper = require("../utils/DingHelper"),
    MailHelper = require("../utils/MailHelper"),
    CodeTemplate = require("../model/CodeTemplate");

let router = express.Router();
//多次用到，在外面进行定义
let adminService = new AdminService();

router.get("/login", (req, resp) => {
    resp.render("admin/login");
});

//检测登陆
router.post("/checkLogin", async (req, resp) => {
    let param = {
        u_id,
        u_password
    } = req.body;
    let adminService = new AdminService();
    try {
        let result = await adminService.checkLogin(param);
        if (result.length == 1) {
            //在这个地方，说明登陆成功了，
            //登陆成功以后，创建一个“保险箱”，来存放信息，用以标识已经登陆了
            req.session.userInfo = result[0];
            MessageBox.showAndRedirect("登陆成功", "/Admin/adminIndex", resp);
        } else {
            MessageBox.showAndBack("用户名或密码失败", resp);
        }
    } catch (error) {
        MessageBox.showAndBack("服务器错误", resp);
    }
});

// 登入主界面
router.get("/adminIndex", (req, resp) => {
    let userInfo = req.session.userInfo; //从“保险箱”里面，拿出刚刚登陆的时候，存入进去的东西
    resp.render("admin/adminIndex", {
        menuConfig: menuConfig,
        userInfo: userInfo
    });
});

// 二维码登录
router.get("/scanCode", async (req, resp) => {

    try {
        //扫码成功以后，跳转到这里
        //钉钉会追加两个参数过来
        //code  state
        let {
            code,
            state
        } = req.query; //接收两个参数
        //console.log(code,state);  //然后要通过这个code来去请求钉钉服务器
        //每一个用户所注册的钉钉账号都有一个特殊的ID  openId  相当于主键，用于标识每一个钉钉账号
        //现在要获取钉钉用户的信息，把这些信息绑定到账号上去
        let access_token = await DingHelper.getAccess_Token();
        let {
            openid,
            persistent_code
        } = await DingHelper.get_persistent_code(access_token, code);
        let sns_token = await DingHelper.getSNSToken(access_token, {
            openid,
            persistent_code
        });
        let dingUserInfo = await DingHelper.getUserInfo(sns_token); //最终获取到的用户信息
        // resp.json(dingUserInfo);
        let userOpenId = dingUserInfo.user_info.openid;

        let result = await adminService.findByOpenId(userOpenId);
        if (result.length <= 0) {
            //不存在账号，提示别人绑定自己的账号
            resp.redirect("/Admin/bindUserInfo?userOpenId=" + userOpenId);
        } else if (result.length == 1) {
            //登陆成功
            delete result[0].u_password;
            req.session.userInfo = result[0];
            resp.redirect("adminIndex");
        } else {
            resp.send("你的账号有问题");
        }
    } catch (error) {
        resp.send("服务器错误");
    }
});

// 通过openid绑定用户
router.get("/bindUserInfo", (req, resp) => {
    let {
        userOpenId
    } = req.query;
    let model = {
        openid: userOpenId
    };
    resp.render("Admin/bindUserInfo", {
        model
    });
});

// 绑定已有账号
router.post("/bindOldUser", async (req, resp) => {
    let {
        openid,
        u_id,
        u_password
    } = req.body;
    //先判断你输入的用户名一密码对不对
    try {
        let result = await adminService.checkLogin({
            u_id,
            u_password
        });
        if (result.length == 1) {
            //说明密码正确，进行绑定
            let flag2 = await adminService.bindOldUser(u_id, openid);
            if (flag2) {
                delete result[0].u_password; //删除密码的属性
                req.session.userInfo = result[0];
                MessageBox.showAndRedirect("绑定成功", "/Admin/login", resp);
            } else {
                MessageBox.showAndBack("绑定失败", resp);
            }
        } else {
            //说明密码错误，不进行绑定
            MessageBox.showAndBack("用户名或密码错误，请重试", resp);
        }
    } catch (error) {
        //服务器错误
        MessageBox.showAndBack("服务器错误", resp);
    }
});

// 绑定新账号
router.post("/bindNewUser", async (req, resp) => {
    let {
        openid,
        u_id,
        u_name,
        u_password
    } = req.body;
    //到数据库去插入
    try {
        let flag = await adminService.bindNewUser({
            openid,
            u_id,
            u_name,
            u_password
        });
        if (flag) {
            req.session.userInfo = {
                openid,
                u_id,
                u_name,
                u_password
            }
            MessageBox.showAndRedirect("绑定成功", "/Admin/login", resp);
        } else {
            MessageBox.showAndBack("绑定失败", resp);
        }
    } catch (error) {
        MessageBox.showAndBack("服务器错误", resp);
    }
});

// 注册界面
router.get("/register", (req, resp) => {
    let registerList = new RegisterList();
    let objArr = Array.from(Object.entries(registerList));
    resp.render("Admin/register", {
        objArr: objArr
    });

});

// 邮箱验证
router.get("/doSendCode", async (req, resp) => {
    //接收一个邮箱地址
    let {
        email
    } = req.query;
    //生成一个随机码
    let code = parseInt(Math.random() * 9999);
    try {
        let mailHelper = new MailHelper();
        let codeTempalte = new CodeTemplate();
        let info = await mailHelper.sendCode(email, "注册验证码", codeTempalte.toString(code));
        let pageJson = new PageJson("success", "邮件发送成功");
        req.session.code = code;        //公共变量，不能跨路由
        console.log(req.session.code);
        resp.json(pageJson);
    } catch (error) {
        let pageJson = new PageJson("error", "发送失败");
        resp.json(pageJson);
    }
});

//执行注册操作
router.post("/doRegister", async (req, resp) => {
    let {
        u_id,
        u_name,
        u_password,
        u_code
    } = req.body;
    
    try {
        if (req.session.code == u_code) {
            let flag = await adminService.doRegister({
                u_id,
                u_name,
                u_password
            });
            if (flag) {
                req.session.userInfo = {
                    u_id,
                    u_name,
                    u_password
                }
                MessageBox.showAndRedirect("注册成功", "/Admin/login", resp);
            } else {
                MessageBox.showAndBack("注册失败", resp);
            }
        }
        else{
            MessageBox.showAndBack("验证码错误，请重试", resp);
        }
    } catch (error) {
        MessageBox.showAndBack("服务器错误", resp);
    }
});

//退出登陆
router.get("/logOut", (req, resp) => {
    //清空session  "保险箱"
    req.session.userInfo = undefined;
    //退出回到登陆页面
    resp.redirect("/Admin/login");
});

module.exports = router;