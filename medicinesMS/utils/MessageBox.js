/**
 * @name 页面弹出消息框
 * @author 艾欢欢
 * @version 1.0
 * @description 弹窗返回与弹窗跳转
 */


 class MessageBox{
     /**
      * @name 弹窗返回
      * @param {String} msg 要弹出显示的消息
      * @param {Object} resp 服务器对象  
      */
     static showAndBack(msg,resp){
        resp.send(`<script>alert("${msg}");history.back()</script>`);
     }
     /**
      * @name 弹窗跳转页面
      * @param {String} msg 要弹出显示的消息
      * @param {String} url 要跳转的URL地址
      * @param {Object} resp 服务器对象  
      */
     static showAndRedirect(msg,url,resp){
         resp.send(`<script>alert("${msg}");location.href="${url}";</script>`);
     }
 }

 module.exports=MessageBox;