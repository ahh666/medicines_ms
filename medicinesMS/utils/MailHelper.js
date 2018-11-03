/**
 * @name 邮件发送的帮助类
 * @author 艾欢欢
 * @version 1.0
 */

//  授权码 gdhorkbgqqynbcae
const nodemail = require("nodemailer");
class MailHelper {
    sendCode(to, title, text) {
        return new Promise((resolve, reject) => {
            //发送验证码
            let mail = nodemail.createTransport({
                service: "qq",
                auth: {
                    user: "ahh666@qq.com",
                    pass: "gdhorkbgqqynbcae"    //授权码
                }
            });
            mail.sendMail({
                to: to,
                from: "ahh666@qq.com",
                subject: title,
                text: text
            }, (err, info) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(info);
                }
            });
        })
    }
}

module.exports=MailHelper;