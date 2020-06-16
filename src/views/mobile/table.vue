<template>
  <div class="table_page">
    <div class="table_info">
      <div class="list_p"><p>录入员编号：</p><p>154498565</p></div>
      <div class="list_p"><p>录入员姓名：</p><p>李四</p></div>
      <div class="list_p"><p>录入员电话：</p><p>15200448899</p></div>
    </div>
    <div class="table_top">
      <div class="table_left">
        <p>单据结算信息如下：</p>
        <p>预约单号：5156165212</p>
        <p>业务号：156454151515</p>
        <p>预约时间：2020-04-15</p>
        <p>序号为：000008</p>
      </div>
      <div class="table_right">
        <img src="../../assets/img/erweima.png" alt="">
      </div>
    </div>
    <p class="frim_title">西安XXX网络开发有限公司日常报销单</p>
    <table border="1" >
      <tr>
        <th>单位</th>
        <th colspan="4">财经处</th>
      </tr>
      <tr>
        <td>经费号</td>
        <td>支出内容</td>
        <td>票据张数</td>
        <td>金额</td>
        <td>备注</td>
      </tr>
      <tr>
        <td>15645846561</td>
        <td class="shenhe">材料采购</td>
        <td class="shenhe">2</td>
        <td class="shenhe">200</td>
        <td class="shenhe">项目启动</td>
      </tr>
      <tr>
        <td>预约报销总金额（大写）</td>
        <td colspan="2">贰佰元整</td>
        <td colspan="2">￥200</td>
      </tr>
      <tr>
        <td class="gongzhang">单位公章：</td>
        <td class="gongzhang"></td>
        <td class="gongzhang">单位负责人（签字）：</td>
        <td class="gongzhang" colspan="2"></td>
      </tr>
    </table>
    <p class="info_tip">以下内容由财务处会计人员填写</p>
    <table border="1">
      <tr>
        <td class="shenhe">审核员签章：</td>
        <td class="shenhe"></td>
        <td class="shenhe">财务处主管审批：</td>
        <td class="shenhe"></td>
      </tr>
    </table>

    <table border="1">
      <tr>
        <td class="frim_info_left">
          <p>支付方式：对公转账</p>
          <p>总金额为：200.00元</p>
          <p>资金描述：材料采购</p>
        </td>
        <td class="frim_info_right">
          <p>对方单位：西安纳学电子科技有限责任公司</p>
          <p>对方地区：西安市</p>
          <p>对方银行：中国建设银行支行</p>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },

    methods: {}
  }
</script>

<style scoped="scoped">
  .table_page{
    padding: 1rem;
  }
  table{
    font-size: 0.75rem;
     border-collapse:collapse;
     line-height: 1rem;
  }
  .table_info{
    font-size: 0.75rem;
    display: flex;

  }
    .table_info .list_p{
      flex: 7;
    }
  .table_info .list_p p{
    text-align: center;
    line-height: 0.875rem;
  }
  .table_top {
    display: flex;
    font-size: 0.75rem;
  }

  .table_left {
    flex: 1;
    padding-left: 0.5rem;
  }

  .table_right {
    flex: 1;
    text-align: center;
  }

  .table_right img {
    margin-top: 0.875rem;
    width: 7.5rem;
    height: 7.5rem;
  }

  .table_left p,
  .table_right p {
    line-height: 0.875rem;
  }
  .frim_title{
    font-size: 1.25rem;
    font-weight: bold;
    text-align: center;
  }
  .shenhe{
    width: 25%;
    height: 3.125rem;
  }
  .info_tip{
    font-size: 0.875rem;
    text-align: center;
  }
  .frim_info_left{
    width: 45%;
  }
  .frim_info_right{
    width: 55%;
  }
  .gongzhang {
    height: 3.125rem;
  }
</style>
