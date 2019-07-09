var netUtil = require("../../utils/request.js"); //require引入
Page({
  data: {

  },
  getPhoneNumber: function(e) {
    wx.login({
      success: res => {
        if (res.code) {
          
          if (e.detail.errMsg == "getPhoneNumber:fail user deny") return;
          //用户授权获取手机号码

          //3. 解密手机号码信息
          var self = this

          var url = 'user/wechatdecrypt';
          var params = {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            code: res.code
          }
          console.log(params)
          netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
            console.log(res.Data);
            wx.redirectTo({
              url: '/pages/binding/binding?phone=' + res.Data.phoneNumber,
            })
          }, function(msg) { //onFailed失败回调
            wx.hideLoading();
            if (msg) {
              wx.showToast({
                title: msg,
              })
            }
          }); //调用get方法情就是户数
        }
      }
    })
    console.log(e);
    
  }
})