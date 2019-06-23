// pages/invite/invite.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  recommendation:function() {
    wx.navigateTo({
      url: '/pages/recommendation/recommendation',
    })
  },
  onShareAppMessage: function () {

  }
})