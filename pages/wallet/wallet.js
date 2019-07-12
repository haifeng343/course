// pages/wallet/wallet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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