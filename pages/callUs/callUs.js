// pages/callUs/callUs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contents: '684784785'
  },
  //复制微信号
  copyText: function (e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  onShareAppMessage: function () {

  }
})