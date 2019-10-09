var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();

Page({
  data: {
    windowHeight: '',
    windowWidth: '',
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

    that.init();
  },

  onUnload:function() {
    var that = this;
    var url = 'wechat/publicnumber/follow/get'
    var params = {}
    netUtil.postRequest(url, params, function (res) { 
    }); 
  },

  init: function () {
    let that = this;
    shareApi.getShare("/pages/pubick/publick", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      });
    });
   },
})