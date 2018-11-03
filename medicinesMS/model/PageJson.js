/**
 * @name 前后台的Ajax的JSON传输
 * @version 1.0
 * @author 艾欢欢
 */

class PageJson{
    /**
     * 
     * @param {String} status success代表请求成功  error代表请求失败 
     * @param {*} msg  请求返回的消息
     * @param {*} data 请求返回的数据
     */
    constructor(status,msg,data){
        this.status=status;     //状态
        this.msg=msg;           //返回的消息
        this.data=data||{};     //数据
    }
}


module.exports=PageJson;