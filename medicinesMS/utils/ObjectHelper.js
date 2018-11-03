/**
 * @name 对象帮助类
 * @version 1.0
 * @author 艾欢欢
 * @description 验证某个值是否为空或undefined
 */

class ObjectHelper{
    /**
     * @name 验证某个值是否为空
     * @param {Object} v 要验证的值
     * @return {Boolean} true则为空 false则不为空 
     */
    static isNullOrUndefined(v){
        if(v!=null&&v!=""&&v!=undefined){
            return false; 
        }
        else{
            return true;
        }
    }
}

module.exports=ObjectHelper;