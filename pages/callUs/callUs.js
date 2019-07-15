
var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    contents: '684784785',
    List:[],
  },
  //复制微信号
  copyText: function (e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  onLoad:function(){
    this.getData();
  },
  getData: function () {
    let that = this;
    var url = 'user/customer/service';
    var params = {
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      console.log(res)
      that.setData({
        List :res.Data
      })
    }, function (msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  onShareAppMessage: function () {

  }
})