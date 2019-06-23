
Page({

  data: {
    hasAddress:true,
  },
  edit:function() {
    wx.navigateTo({
      url: '/pages/editAddress/editAddress',
    })
  },
  onShareAppMessage: function () {

  }
})