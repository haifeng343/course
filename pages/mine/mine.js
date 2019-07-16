var netUtil = require("../../utils/request.js"); //require引入
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    recommandCode: '',
    money:'',
    score:'',
  },
  onShow() {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo,
      recommandCode: userInfo.RecommandCode || '',
    })
    this.walletd();
  },
  walletd: function () {
    let that = this;
    var url = 'user/wallet';
    var params = {
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      that.setData({
        money: Number(res.Data.Money / 100).toFixed(2),
        score:res.Data.Score
      })
      wx.setStorageSync('wallet', res.Data)
    }, function (msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  onLoad() {

  },

  integral: function(e) {
    wx.navigateTo({
      url: '/pages/integralLog/integralLog',
    })
  },
  callUs: function() {
    wx.navigateTo({
      url: '/pages/callUs/callUs',
    })
  },
  setting: function() {
    wx.navigateTo({
      url: '/pages/setting/setting?mobile=' + this.data.userInfo.Mobile + '&ids=' + 1,
    })
  },
  invite: function() {
    wx.navigateTo({
      url: '/pages/invite/invite',
    })
  },
  share: function(e) {
    wx.navigateTo({
      url: '/pages/share/share?Id=' + e.currentTarget.dataset.id,
    })
  },
  wallet: function() {
    wx.navigateTo({
      url: '/pages/wallet/wallet',
    })
  },
  getUserInfo: function(e) {
    var that = this;
    // 查看是否授权
    
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              var Info = res;
              wx.login({
                success: res => {
                  var url = 'user/login/wechat';
                  var params = {
                    Code: res.code,
                    EncryptedData: Info.encryptedData,
                    RecommandCode: that.recommandCode,
                    Iv: Info.iv,
                    RawData: Info.rawData,
                    Signature: Info.signature
                  }
                  wx.setStorage({
                    key: 'code',
                    data: res.code,
                  });
                  netUtil.postRequest(url, params, that.onSuccess, that.onFailed); //调用get方法情就是户数
                }
              });
            }
          });
        } else {
          // 用户没有授权
          wx.redirectTo({
            url: '/pages/authorization/authorization',
          })
        }
      }
    });
  },
  onSuccess: function(res) { //onSuccess成功回调
    let that = this;
    that.userInfo = res.Data;
    wx.setStorageSync('userInfo', that.userInfo);
    wx.setStorageSync('usertoken', res.Data.UserToken);
    that.setData({
      userInfo:res.Data
    })
  },
  onFailed: function() { //onFailed失败回调
    wx.showToast({
      icon: 'none',
      title: res.Data.ErrorMessage,
    })
  },
  onShareAppMessage: function() {

  }
})