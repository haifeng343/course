var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: ['list1', 'list2', 'list3', 'list4', 'list5', ],
    statusBarHeight: app.globalData.statusBarHeight,
    windowHeight: app.globalData.windowHeight,
    windowWidth: app.globalData.windowWidth,
    status: 0,
    show: false
  },

  onLoad(options) {
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    wx.setStorageSync('promptText', this.data.promptText);
    var userInfo = wx.getStorageSync('userInfo');
    var recommand = userInfo.RecommandCode;
    shareApi.getShare("/pages/mine/mine", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      this.setData({
        obj: res.Data,
      })
    })
  },
  getStatus(e) {
    console.log(e)
    this.setData({
      status: e.currentTarget.dataset.index,
      show: true
    })
  },
  findPosition: function() {
    let that = this;
    that.setData({
      position: 'position1'
    });
    // let that = this;
    // wx.getSystemInfo({
    //   success: function (res) {
    //     that.widHeight = res.windowHeight - (res.windowWidth * 90 / 750) + 'px'
    //   },
    // })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail)
  },
  onShareAppMessage: function() {

  }
})