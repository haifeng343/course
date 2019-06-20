let app = getApp();

Page({

  
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
  },

  prvent:function() {
    wx.navigateBack({ changed: true });
  },
  onShareAppMessage: function () {

  }
})