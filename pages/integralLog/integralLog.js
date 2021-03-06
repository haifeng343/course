var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    score: '',
    avator: '',
    usertoken: '',
  },

  onShow: function() {
    let userInfo = wx.getStorageSync('userInfo') || {};
    this.setData({
      score: userInfo.Score || '',
      avator: userInfo.HeadUrl || '',
      usertoken: userInfo.UserToken || ''
    })
  },

  jifen: function() {
    wx.navigateTo({
      url: '/pages/jifen/jifen',
    })
  },

  onLoad: function(options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
    });

    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }

    that.init();
  },

  init: function() {
    let that = this;
    shareApi.getShare("/pages/integralLog/integralLog", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    });
  },

  bindDec: function () {
    let that = this;
    if (that.selectComponent('#dialog')) {
      that.selectComponent('#dialog').init('积分说明', "ScoreRules");
    }
  },
  
  navtoIntegral: function() {
    wx.navigateTo({
      url: '/pages/integralList/integralList',
    })
  },

  //上拉加载更多
  onReachBottom: function() {

  },

  //下拉刷新
  onPullDownRefresh: function() {
 
  },

  onShareAppMessage: function(res) {
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