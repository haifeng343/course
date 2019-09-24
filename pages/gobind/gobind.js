var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({
  data: {
    windowHeight:'',
    windowWidth:'',
    code: "",
  },

  init: function() {},
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
    shareApi.getShare("/pages/gobind/gobind",0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,

      })
    })
    wx.login({
      success: res => {
        that.setData({
          code: res.code,
        })
      }
    })
  },
  getPhoneNumber: function(e) {
    console.log(e);
    var that = this
    if (e.detail.errMsg == "getPhoneNumber:fail user deny") return;
    //用户授权获取手机号码
    var url = 'user/wechatdecrypt';
    var params = {
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      code: that.data.code
    }

    netUtil.postRequest(url, params, function(res) {
      console.log(res.Data);
      wx.redirectTo({
        url: '/pages/binding/binding?phone=' + res.Data.phoneNumber+'&fromtype=1',
      })
    });
  }
})