// pages/bankList/bankList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bg1:'#FF4F4F',
    bg2:'#E88786',
    showSuccess:false,
  },
  closeded:function(){
    this.setData({
      showSuccess : false
    })
  },
  addBank:function(){
    wx.navigateTo({
      url: '/pages/addBank/addBank',
    })
  },
  onLoad: function (options) {

  },
  onShareAppMessage: function () {

  }
})