var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    mobile: '',
    name: '修改手机号',
    ids: 1,
  },
  onLoad(options) {
    console.log(options)
    if (options.mobile) {
      this.setData({
        mobile: options.mobile,
        name: '修改手机号'
      })
    } else {
      this.setData({
        name: '绑定手机号'
      })
    }
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

  },
  modify: function() {
    wx.navigateTo({
      url: '/pages/binding/binding?phone=' + this.data.mobile + '&ids=' + this.data.ids,
    })
  },
  exitOut: function() {
    wx.removeStorage({
      key: 'userInfo',
      success: function(res) {
        console.log(res)
      },
    })
    wx.removeStorage({
      key: 'usertoken',
      success: function(res) {
        console.log(res)
      },
    })
  },
  address: function() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  onShareAppMessage: function() {

  }
})