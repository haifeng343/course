var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    windowHeight: app.globalData.windowHeight,
    Id:'',
    BaseList:[],
  },
  onLoad: function (options) {
    let that = this;
    that.setData({
      Id:options.Id || ''
    })
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare("/pages/rewradRule/rewradRule",0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,
        type: options.type || ''
      })
    })
    that.init();
  },
  init: function () {
    var that = this;
    var url = 'order/rules'
    var params = {
      Id: that.data.Id
    }
    netUtil.postRequest(url, params, function (res) {
      res.Data.forEach(item=>{
        item.PrizeAmount = Number(item.PrizeAmount/100).toFixed(2);
      })
      that.setData({
        BaseList:res.Data
      })
    });
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