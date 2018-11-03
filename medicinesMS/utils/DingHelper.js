/**
 * @name 钉钉的帮助类
 * @author 艾欢欢
 */
const axios=require("axios");  //可以把它当成superAgent或ajax 都是用来发请求的
class DingHelper{
    //第一步：先获取Access_token
    static async  getAccess_Token(){
        var url=`https://oapi.dingtalk.com/sns/gettoken?appid=dingoat17fjzaqhbuijem6&appsecret=OHNDBUVE-_U1rsovKnbl5QzzfqZow332qGfMnSSg8dQh6DevVBa-Jf5zC7eJzY1m`;
        // axios.default.get(url).then(resp=>{
        //     //resp就是钉钉返回给我的停止
        //     console.log(resp.data.access_token);
        // });
        let resp=await axios.default.get(url);
        return resp.data.access_token;
    }
    //第二步：获取持久码
    static async  get_persistent_code(access_token,tmp_auth_code){
        var url=`https://oapi.dingtalk.com/sns/get_persistent_code?access_token=${access_token}`;
        let resp =await axios.default.post(url,{
            tmp_auth_code:tmp_auth_code
        });
        let {openid,persistent_code}=resp.data;

        return {openid,persistent_code};
    }
    //第三步：获取SNS_TOKEN
    static async  getSNSToken(access_token,{openid,persistent_code}){
        var url=`https://oapi.dingtalk.com/sns/get_sns_token?access_token=${access_token}`;
        let resp =await axios.default.post(url,{
            openid:openid,
            persistent_code:persistent_code
        });
        return resp.data.sns_token;
    }
    //第四步：获取用户的信息
    static async  getUserInfo(sns_token){
        var url=`https://oapi.dingtalk.com/sns/getuserinfo?sns_token=${sns_token}`;
        let resp=await axios.default.get(url);
        return resp.data;
    }
}

module.exports=DingHelper;