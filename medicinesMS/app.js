/**
 * @name 程序入口文件
 * @author 艾欢欢
 * @version 2.0
 * @requires express
 * @description  加了session实现登陆验证，添加拦截器
 */
const express = require("express"),
    http = require("http"),
    template = require("express-art-template"),
    path = require("path"),
    bodyParser = require("body-parser"),
    session = require("express-session");

let app = express();

//加载了session中间插件
app.use(session({
    secret: "aasdfasdf",
    saveUninitialized: false,
    resave: true //是否可以更改里面的值
}));


app.engine("html", template);
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "html");
app.use("/public", express.static(path.join(__dirname, "./public")));
//加载POST取值插件 bodyParser
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


//添加一个拦截器
app.use((req, resp, next) => {
    //所有的请求都会经过这个拦截器
    // console.log("经过拦截器了"+new Date().toLocaleString());   
    //判断一下有没有登陆，如果没有登陆，就不放行，如果登陆了，就放行
    if (req.session.userInfo != undefined) {
        next(); //拦截器放行，继续往后面走
    } else {
        if (req.path.includes("/Admin")) {
            //说明，本来就是要去登陆的，放行
            next();
        } else {
            //没有登陆的，就跳转到登陆页去登陆
            resp.redirect("/Admin/login");
        }
    }
});

app.get("/", (req, resp) => {
    resp.redirect("Admin/login");
});

//导入路由文件
// const StockRouter = require("./routers/StockRouter"),
//         StockIORouter= require("./routers/StockIORouter");

//加载路由  放在后面
app.use("/Admin", require("./routers/AdminRouter"))
app.use("/Stock", require("./routers/StockRouter"));
app.use("/Stock_IO", require("./routers/StockIORouter"));

let server = http.createServer(app);
//启动监听
server.listen(80, () => {
    console.log("服务器启动成功..");
});