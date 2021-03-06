var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    code: "",
    type: "",
  },

  init: function() {
    let that = this;
    shareApi.getShare("/pages/gobind/gobind", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    })
  },

  onLoad: function(options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
      type: options.type || '',
    });

    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }

    wx.login({
      success: res => {
        that.setData({
          code: res.code,
        })
      }
    })

    that.init();
  },

  getPhoneNumber: function(e) {
    let that = this;
    if ((e.detail.errMsg).toLowerCase() == "getphonenumber:ok" && e.detail.iv != null && e.detail.iv.length > 0) {
      //用户授权获取手机号码
      var url = 'user/wechatdecrypt';
      var params = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        code: that.data.code,
        Type:2
      }
      netUtil.postRequest(url, params, function(res) {
        let userInfo = wx.getStorageSync('userInfo');
        userInfo.Mobile = res.Data.phoneNumber;
        wx.setStorageSync('userInfo', userInfo);
        wx.showModal({
          content: '成功绑定手机号',
          showCancel:false,
          confirmText:"确定",
          confirmColor:"#000",
          success:function(){
            wx.navigateBack({
              delta: 1
            })
          }
        })
      });
    }
  }
})