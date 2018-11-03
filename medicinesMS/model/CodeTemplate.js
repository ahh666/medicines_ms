/**
 * @name 邮件验证码的模型
 * @author 艾欢欢
 * @version 1.0
 */

 class CodeTempalte{
     toString(code){
         return `尊敬的用户，你好！
    欢迎注册本平台，本次您的验证码为${code},如有疑问，请回复邮件!
    
                                        ${new Date().toLocaleString()}`;
     }
 }

 module.exports=CodeTempalte;