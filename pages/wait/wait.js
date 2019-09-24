var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
var setTime;
const app = getApp();

Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    orderId: '',
    ordersn: '',
    payamount: '',
    type: "",
  },
  onShow: function() {
    this.timefc();
  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
    });
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare("/pages/wait/wait", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,
      })
    })

    that.setData({
      orderId: options.OrderId || '',
      ordersn: options.ordersn || '',
      payamount: options.money || '',
      type: options.type || "",
    })
    // let userToken = wx.getStorageSync('usertoken');
    // if (userToken) {} else {
    //   if (setTime) {
    //     clearInterval(setTime);
    //   }
    //   wx.navigateTo({
    //     url: '/pages/login/login',
    //   })
    // }
  },
  init: function() {

  },
  timefc: function() {
    let that = this;
    if (setTime) {
      clearInterval(setTime);
    }
    setTime = setInterval(function() {
      that.payok(false, function(res) {
        if (res.IsPay) {
          clearInterval(setTime);
          wx.redirectTo({
            url: '/pages/payOk/payOk?OrderId=' + that.data.orderId + '&type=' + that.data.type,
          })
        }
      });
    }, 2000);
  },
  //支付成功
  payok: function(isShowLoading, onSuccess) {
    var that = this;
    var url = 'order/pay/issuccess'
    var params = {
      OrderId: that.data.orderId,
    }
    netUtil.postRequest(url, params, function(res) {
        that.setData({
          orderContent: res.Data
        })
        onSuccess(res.Data);
      },
      function(val) {
        console.log(1111111)
        if (setTime) {
          clearInterval(setTime);
        }
      },
      isShowLoading,
      false);
  },
  groupTo: function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  onUnload: function() {
    clearInterval(setTime);
  },
  bindPayok: function() {
    let that = this;
    that.payok(true, function(res) {
      if (res.IsPay) {
        clearInterval(setTime);
        wx.redirectTo({
          url: '/pages/payOk/payOk?OrderId=' + that.data.orderId + '&type=' + that.data.type,
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '购买未完成，请稍后重试...',
        })
      }
    });
  },
  onShareAppMessage: function(res) {
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