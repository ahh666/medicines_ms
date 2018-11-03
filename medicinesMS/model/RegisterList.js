/**
 * @name 模型对象（注册信息） 与数据库的列一一对应
 * @author 艾欢欢
 * @version 1.0
 * @description MVC当中的model
 */

class RegisterList {
    constructor(u_id, u_name, u_password,u_password_s,u_email,u_code) {
        this.u_id = u_id || "账号";
        this.u_name = u_name || "姓名";
        this.u_password = u_password || "密码";
        this.u_password_s = u_password_s || "确认密码";
        this.u_email = u_email || "邮箱";
        this.u_code = u_code || "验证码";
    }
}

module.exports = RegisterList;