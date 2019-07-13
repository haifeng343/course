
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    ids:1,
  },
  onLoad(options){
    console.log(options)
    this.setData({
      mobile: options.mobile,
    })
  },
  modify:function() {
    wx.navigateTo({
      url: '/pages/binding/binding?phone='+this.data.mobile+'&ids='+this.data.ids,
    })
  },
  exitOut:function(){
    wx.removeStorage({
      key: 'userInfo',
      success: function(res) {
        console.log(res)
      },
    })
    wx.removeStorage({
      key: 'usertoken',
      success: function (res) {
        console.log(res)
      },
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