// pages/demo/demo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    widHeight:'100%',
    toView:'productBox',
    position:"position1"
  },

  onLoad: function (options) {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.widHeight = res.windowHeight-(res.windowWidth*90/750)+'px'
      },
    })
  },
  findPosition:function() {

  },

  onShareAppMessage: function () {

  }
})