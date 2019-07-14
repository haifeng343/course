var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bg1: '#FF4F4F',
    bg2: '#E88786',
    showSuccess: false,
  },
  closeded: function() {
    this.setData({
      showSuccess: false
    })
  },
  addBank: function() {
    wx.navigateTo({
      url: '/pages/addBank/addBank',
    })
  },
  onLoad: function(options) {
    this.getData();
  },
  getData: function() {
    let that = this;

    var url = 'user/bank/card/list';
    var params = {
     
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      console.log(res);
    }, function(msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  onShareAppMessage: function() {

  }
})