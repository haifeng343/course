
Page({


  data: {
    showSuccess:false
  },

  onLoad: function (options) {

  },
  exchange:function() {
    wx.navigateTo({
      url: '/pages/exchange/exchange',
    })
  },
  onShareAppMessage: function () {

  }
})