
Page({

  
  data: {

  },

  navto: function() {
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail',
    })
  },
  groupTo: function() {
    wx.navigateTo({
      url: '/pages/groupDetail/groupDetail',
    })
  },
  onShareAppMessage: function() {

  }
})