// pages/fund/fund.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLog: false,//转入余额
    showSuccess: false,//转入余额成功
  },

  onLoad: function (options) {

  },
  bindAbout:function() {
    wx.navigateTo({
      url: '/pages/aboutUs/aboutUs',
    })
  },
  transpond:function(e) {
    this.onShareAppMessage
  },
  onShareAppMessage: function (res) {
    console.log(res.from);
    let _this = this;
    let shareObj = {
      title: '转发',
      path: '/pages/fund/fund?type=1',
      imageUrl: 'https://goss1.cfp.cn/creative/vcg/800/new/VCG211162314890.jpg',
      success: function (res) {
        console.log("转发成功！");
        console.log(res);
        wx.showShareMenu({
          withShareTicket:true
        })
      }
    }
    console.log(shareObj);
    return shareObj;
  }
})