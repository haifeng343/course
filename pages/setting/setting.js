
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
  },
  onLoad(options){
    console.log(options)
    this.setData({
      mobile: options.mobile,
    })
  },
  modify:function() {
    wx.navigateTo({
      url: '/pages/binding/binding?phone='+this.data.mobile,
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