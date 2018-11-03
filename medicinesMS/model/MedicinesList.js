/**
 * @name 模型对象（药品库存） 与数据库的列一一对应
 * @author 艾欢欢
 * @version 1.0
 * @description MVC当中的model
 */

class MedicinesList {
    constructor(m_id, m_name, m_lotnum, m_number, m_unit, m_bit,m_sell,a_id) {
        this.m_id = m_id || "药品编号";
        this.m_name = m_name || "药品名称";
        this.m_lotnum = m_lotnum || "药品批次";
        this.m_number = m_number || "药品库存";
        this.m_unit = m_unit || "单位";
        this.m_bit = m_bit || "进价";
        this.m_sell = m_sell || "预售价";
        this.a_id = a_id || "验收员编号";
    }
}

module.exports = MedicinesList;