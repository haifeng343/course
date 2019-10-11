var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
Page({

  data: {
    showSuccess:false,//预约成功弹窗
  },
  onLoad: function (options) {
    let that = this;
    that.init();
  },
  init: function () {
    let that = this;
    shareApi.getShare("/pages/reservation/reservation", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    })
  },
  //预约时间
  navtoAppointTime:function() {
    wx.navigateTo({
      url: '/pages/appointment/appointment',
    })
  },
  //申请预约
  shenqing:function() {
    this.setData({
      showSuccess: true
    })
  },
  closeded:function() {
    this.setData({
      showSuccess:false
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: this.data.obj.Title,
      path: this.data.obj.SharePath,
      desc: this.data.obj.ShareDes,
      imageUrl: this.data.obj.ShareImgUrl,
      success: (res) => {
        wx.showToast({
          icon: 'none',
          title: '分享成功',
        })
      }
    }
  },
})