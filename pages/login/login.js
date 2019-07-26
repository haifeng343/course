var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    Info: {},
    recommandCode: '',
    userInfo: {},
  },
  onLoad: function() {
    this.setData({
      recommandCode: wx.getStorageSync('recommand')
    })
  },
  getUserInfo: function(e) {
    var that = this;
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
                  netUtil.postRequest(url, params, that.onSuccess, that.onFailed); //调用get方法情就是户数
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
  onFailed: function() { //onFailed失败回调
    wx.showToast({
      icon: 'none',
      title: res.Data.ErrorMessage,
    })
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
      wx.navigateBack({
        delta: 1
      })
    });
  },
  onShareAppMessage: function() {

  }
})