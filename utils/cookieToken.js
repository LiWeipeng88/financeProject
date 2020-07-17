export default {
  //设置cookie
  setCookie(c_name, c_pwd, exdays) {
    var exdate = new Date();//获取时间
    exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays);//保存的天数
    //字符串拼接cookie
    window.document.cookie = "username" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
    window.document.cookie = "password" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
  },
  //读取cookie
  getCookie: function () {

  },
  //清除cookie
  clearCookie: function () {
    this.setCookie("", "", -1);//修改2值都为空，天数为负1天就好了
  },
}