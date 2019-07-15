var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'',
  },
  onShow(){
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      money: Number(userInfo.Money/100).toFixed(2)
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
  onShareAppMessage: function () {

  }
})