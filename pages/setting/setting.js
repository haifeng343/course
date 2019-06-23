// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  modify:function() {
    wx.navigateTo({
      url: '/pages/modifyPhone/modifyPhone',
    })
  },
  address:function() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  onShareAppMessage: function () {

  }
})