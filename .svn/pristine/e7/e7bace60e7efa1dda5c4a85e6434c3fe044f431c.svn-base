var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'',
  },
  onLoad:function(options) {
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare().then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      this.setData({
        obj: res.Data,

      })
    })
  },
  init:function() {

  },
  onShow(){
    let wallet = wx.getStorageSync('wallet');
    this.setData({
      money: wallet? Number(wallet.Money/100).toFixed(2):0
    })
  },
  Bill:function(){
    wx.navigateTo({
      url: '/pages/bill/bill',
    })
  },
  withdraw:function() {
    wx.navigateTo({
      url: '/pages/withdraw/withdraw',
    })
  },
  cashBack: function () {
    wx.navigateTo({
      url: '/pages/cashBack/cashBack',
    })
  },
  balanceLog:function(){
    wx.navigateTo({
      url: '/pages/ballanceLog/balanceLog',
    })
  },
  bankList:function(){
    wx.navigateTo({
      url: '/pages/bankList/bankList',
    })
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