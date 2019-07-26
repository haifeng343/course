var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:'',
    ordersn:'',
    payamount:'',
  },

  onLoad: function (options) {
    let that = this;
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare().then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,

      })
    })

    console.log(options)
    that.setData({
      orderId: options.OrderId,
      ordersn: options.ordersn,
      payamount: options.money
    })
    var setTime = setTimeout(function () {
      that.payok(function (res) {
        if (res.IsPay) {
          clearTimeout(setTime);
          wx.redirectTo({
            url: '/pages/payOk/payOk?OrderId=' + that.data.orderId,
          })
        }
      });
    }, 2000);
  },
  init:function() {

  },
  //支付成功
  payok: function (onSuccess) {
    var that = this;
    var url = 'order/pay/issuccess'
    var params = {
      OrderId: that.data.orderId,
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调、
      that.setData({
        orderContent: res.Data
      })
      onSuccess(res.Data);
    });
  },
  groupTo:function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  bindPayok:function() {
    let that = this;
    that.payok(function (res) {
      if (res.IsPay) {
        clearTimeout(setTime);
        wx.redirectTo({
          url: '/pages/payOk/payOk?OrderId=' + that.data.orderId,
        })
      }else{
        wx.showToast({
          icon:'none',
          title: '购买未完成，请稍后重试...',
        })
      }
    });
  },
  onShareAppMessage: function (res) {
    return {
      title: this.data.obj.Title,
      path: this.data.obj.SharePath,
      desc: this.data.obj.ShareDes,
      imageUrl: this.data.obj.ShareImgUrl,
      success: (res) => {
        wx.showToast({
          icon: 'none',
          title: '分享成功',
        })
      }
    }
  },
})