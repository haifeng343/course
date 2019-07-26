// pages/WebView/WebView.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    htmlSrc:'',
  },
  bindHttp:function(){
    wx.navigateTo({
      url: 'https://www.baidu.com',
    })
    wx.setNavigationBarTitle({
      title: '',
    })
  },
  init: function () {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      htmlSrc: options.path
    })
  },
})