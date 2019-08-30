var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
var setTime;
Page({


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
      orderId: options.OrderId || '',
      ordersn: options.ordersn || '',
      payamount: options.money || ''
    })
    setTime = setInterval(function () {
      that.payok(false, function (res) {
        if (res.IsPay) {
          clearInterval(setTime);
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
  payok: function (isShowLoading, onSuccess) {
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
    },
    '', 
    isShowLoading,
    isShowLoading);
  },
  groupTo:function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  onUnload  :function() {
    clearInterval(setTime);
  },
  bindPayok:function() {
    let that = this;
    that.payok(true, function (res) {
      if (res.IsPay) {
        clearInterval(setTime);
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