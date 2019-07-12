// pages/mine/mine.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
  },
  onLoad(){
    let userInfo = wx.getStorageSync('userInfo');
    console.log(userInfo)
    this.setData({
      userInfo: userInfo,
    })
  },

  integral:function() {
    wx.navigateTo({
      url: '/pages/integralLog/integralLog',
    })
  },
  callUs:function() {
    wx.navigateTo({
      url: '/pages/callUs/callUs',
    })
  },
  setting:function() {
    wx.navigateTo({
      url: '/pages/setting/setting?mobile='+this.data.userInfo.Mobile+'&ids='+1,
    })
  },
  invite:function() {
    wx.navigateTo({
      url: '/pages/invite/invite',
    })
  },
  wallet:function(){
    wx.navigateTo({
      url: '/pages/wallet/wallet',
    })
  },
  onShareAppMessage: function () {

  }
})