var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: "",
    windowWidth: "",
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    Info: {},
    recommandCode: '',
    userInfo: {},
  },
  onLoad: function(options) {

    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
    });
    that.setData({
      recommandCode: wx.getStorageSync('recommand'),
    })
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    wx.setStorageSync('promptText', that.data.promptText);
    var userInfo = wx.getStorageSync('userInfo');
    var recommand = userInfo.RecommandCode;
    shareApi.getShare("/pages/login/login", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,
      })
    })
    let logintype = options.logintype;
    if (logintype == 1) {
      //被动登录
      that.selectComponent("#pop").getData("login_bd");
    } else {
      that.selectComponent("#pop").getData("login_zd");
    }
  },
  getUserInfo: function(e) {
    var that = this;
    let formId = "";
    if (e.detail.formId != "the formId is a mock one") {
      formId = e.detail.formId;
    }
    // 查看是否授权
    wx.login({
      success: res => {
        wx.getSetting({
          success: function(v) {
            if (v.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success: function(e) {
                  console.log(that.data.recommandCode)
                  var url = 'user/login/wechat';
                  var params = {
                    Code: res.code,
                    EncryptedData: e.encryptedData,
                    RecommandCode: that.data.recommandCode,
                    Iv: e.iv,
                    RawData: e.rawData,
                    Signature: e.signature
                  }
                  // console.log(params);return;
                  netUtil.postRequest(url, params, that.onSuccess, null, true, true, true, formId); //调用get方法情就是户数
                }
              });
            }
          }
        });
      }
    })

  },
  onSuccess: function(res) { //onSuccess成功回调
    let that = this;
    that.userInfo = res.Data;
    wx.setStorageSync('userInfo', that.userInfo);
    wx.setStorageSync('usertoken', res.Data.UserToken);

    that.walletd();
  },
  walletd: function() {
    let that = this;
    var url = 'user/wallet';
    var params = {}
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
        wx.setStorageSync('wallet', res.Data);
        var pages = getCurrentPages();
        var beforePage = pages[pages.length - 2];
        beforePage.init();
        if (!res.Data.Mobile) {
          wx.redirectTo({
            url: '/pages/gobind/gobind',
          })
        } else {
          wx.navigateBack({
            delta: 1
          })
        }
      },
      null,
      false,
      false,
      false);
  },
})