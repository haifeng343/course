// pages/withdraw/withdraw.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSure: false,
    showSuccess:false,//提现申请成功
  },
  submitTo:function(){
    this.setData({
      showSure:false,
      showSuccess:true,
    })
  },
  closeded: function () {
    this.setData({
      showSuccess: false,
    })
  },
  withdrawLog:function(){
    wx.navigateTo({
      url: '/pages/withdrawLog/withdrawLog',
    })
  },
  nohaveTo:function(){

  },
  onShareAppMessage: function () {

  }
})