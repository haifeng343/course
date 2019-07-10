
var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    checked:false,
    Id:"",
    relId:'',
  },
  onLoad(options){
    let that =this;
    that.setData({
      Id:options.Id,
      relId:options.ids,
    })
    this.getData();
  },
  getData: function () {
    var that = this;
    var url = 'sheet/buy/details'
    var params = {
      SheetId: that.data.Id,
      RelId: that.data.relId
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调、
      console.log(res)
    }, function (msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  swich:function() {
    var checked = this.data.checked;
    this.setData({
      "checked": !checked
    })
  },
  paySure:function() {
    wx.showToast({
      title: '正在提交订单',
      icon: 'loading',
      duration: 1000
    });
    wx.showToast({
      title: '用户取消支付',
      image: '../../images/cancel.png',
      duration: 2000
    });
  },
  onShareAppMessage: function () {
    
  }
})