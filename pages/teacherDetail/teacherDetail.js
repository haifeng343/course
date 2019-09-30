var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({

  data: {
    windowHeight: '',
    windowWidth: '',
    Id: '', //教师Id
    Info:{},//详情
  },
  onLoad(options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
    });
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare("/pages/chooseClass/chooseClass", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,

      })
    })
    that.setData({
      Id: options.id || '',
    })
    that.getData();
  },
  getData: function () {
    var that = this;
    var url = 'sheet/teacher/details';
    var params = {
      Id: that.data.Id
    }
    netUtil.postRequest(url, params, function (res) {
      that.setData({
        Info:res.Data
      })
    },null,false,true,true);
  },
  onShareAppMessage: function () {

  }
})