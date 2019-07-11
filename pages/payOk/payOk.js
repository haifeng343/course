var netUtil = require("../../utils/request.js"); //require引入
Page({

  
  data: {
    orderId:'',
    detail:{},
  },
  onLoad(options){
    this.setData({
      orderId: options.OrderId
    })
    this.getData();
  },
  getData: function () {
    var that = this;
    var url = 'order/pay/issuccess'
    var params = {
      OrderId: that.data.orderId,
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调、
      that.setData({
        detail:res.Data
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
  navto: function() {
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?Id=' + this.data.orderId +'&Status='+1,
    })
  },
  groupTo: function() {
    wx.switchTab({
      url: '/pages/index/index?',
    })
  },
  onShareAppMessage: function() {

  }
})