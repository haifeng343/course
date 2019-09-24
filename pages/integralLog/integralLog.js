var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    date: '', //不填写默认今天日期，填写后是默认日期
    date2: [],
    dataStart: '', //有效日期
    dataEnd: '', //
    showError: false,
    pagecount: 20,
    page: 1,
    year: '',
    month: '',
    array: [],
    statusdes: '',
    List: [],
    score: '',
    avator: '',
    usertoken: '',
  },
  onShow: function() {
    let usertoken = wx.getStorageSync('usertoken');
    let userInfo = wx.getStorageSync('userInfo');
    let wallet = wx.getStorageSync('wallet');
    this.setData({
      score: wallet.Score || '',
      avator: userInfo.HeadUrl || '',
      usertoken: usertoken
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
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare("/pages/integralLog/integralLog",0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,

      })
    })
    that.init();
  },
  init() {

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