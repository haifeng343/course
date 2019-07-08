var netUtil = require("../../utils/request.js"); //require引入
Page({
  data: {

  },
  /**
   * 获取用户手机号码
   */
  getPhoneNumber: function(e) {
    //checkSession（callback) 登录有效性验证函数，接收回调函数
    //调用checkSession（callback) ，把getPhoneNumber的业务逻辑作为参数传递给验证函数，以便checkSession（callback)在验证登录有效性之后做出相应的处理
    console.log(e);
    //用户取消获取手机号码授权
    if (e.detail.errMsg == "getPhoneNumber:fail user deny") return;
    //用户授权获取手机号码
    var code = wx.getStorageSync("code")
    //3. 解密手机号码信息
    var self = this
    // wx.request({
    //   url: 'https://test.guditech.com/rocketclient/user/wechatdecrypt',
    //   data: {
    //     'encryptedData': e.detail.encryptedData,
    //     'iv': e.detail.iv,
    //     'code': code
    //   },
    //   method: 'POST', 
    //   header: {
    //     'userToken': 'AA8D9EF3-1604-4815-A8C8-13815F725F07',
    //     'content-type': 'application/json'
    //   }, // 设置请求的 header
    //   success: function(data2) {
    //     wx.hideLoading()
    //     if (data2.statusCode == 200) {
    //       //成功获取手机号码              
    //       if (data2.data.phoneNumber) {
    //         wx.showToast({
    //           title: data2.data.phoneNumber
    //         })
    //         self.setData({ //******出现异常的代码部分********//
    //           phone: '新消息'
    //         })
    //       } else {
    //         console.log(data2.data)
    //       }
    //     }
    //   },
    //   fail: function(err) {
    //     console.log(err);
    //   }
    // })
    var url = 'user/wechatdecrypt';
    var params = {
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      code: code
    }

    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      console.log(res.Data);
      wx.navigateTo({
        url: '/pages/binding/binding',
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
})