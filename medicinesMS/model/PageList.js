/**
 * @name 封装的页面分页对象，里面有页码，页每页显示多少条，共多少页，共多少条，以及查询结果
 * @author 艾欢欢
 * @version 1.0.0
 */

class PageList{
    /**
     * @name 返回到页面的数据
     * @param {Number} pageIndex 代表当前页 
     * @param {Number} sumCount  共多少条数据
     * @param {Array} listData   查询结果
     */
    constructor(pageIndex,sumCount,listData){
        this.pageIndex=pageIndex;
        this.sumCount=sumCount;
        this.pageSize=10;                   
        this.pageCount=Math.ceil(this.sumCount/this.pageSize);      //计算总页数
        this.listData=listData;
    }
}

module.exports=PageList;