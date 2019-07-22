var netUtil = require("../../utils/request.js"); //require引入
let app = getApp();

Page({

  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    Info: {},
    recommandCode: '',
    userInfo:{},
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
                  netUtil.postRequest(url, params, that.onSuccess, that.onFailed); //调用get方法情就是户数
                }
              });
            }
          });
        } else {
          // 用户没有授权

        }
      }
    });
  },
  onSuccess: function (res) { //onSuccess成功回调
  let that = this;
    wx.showToast({
      icon:'none',
      title: '授权成功',
    })
    that.userInfo = res.Data;
    wx.setStorageSync('userInfo', that.userInfo);
    wx.setStorageSync('usertoken', res.Data.UserToken);
    if (res.Data.Mobile == "" || res.Data.Mobile ==null){
      wx.redirectTo({
        url: '/pages/gobind/gobind',
      })
    }else{
      wx.navigateBack({
        delta:1
      })
    }
  },
  onFailed: function () { //onFailed失败回调
    wx.showToast({
      icon: 'none',
      title: '授权失败！',
    })
  },
  onShow: function() {

  },

  onUnload: function() {

  },
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
         let moment = res.data
      },
    })
  }
})