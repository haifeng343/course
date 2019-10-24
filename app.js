const app = getApp();
var netUtil = require("utils/request.js"); //require引入
App({
  // 头部导航栏的高度
  onLaunch: function() {
    var that = this;

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // console.log(res)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          // wx.navigateTo({
          //   url: '/pages/authorization/authorization',
          // })
        }
      },
    })
    that.getKeyWord();
  },
  onLoad() {
    wx.loadFontFace({ //微信小程序平方字体

      family: 'PingFangSC-Medium',

      source: 'url("https://www.your-server.com/PingFangSC-Medium.ttf")',

      success: function() {}
    })
  },
  getKeyWord: function() {
    let that = this;
    var url = 'user/place/key';
    var params = {}

    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
        wx.setStorageSync('keyword', res.Data.Keyword)
      },
      null,
      false,
      false,
      false);
  },
  getGreen:function(height) {
    let res = wx.getSystemInfoSync();
    return {
      windowWidth: res.windowWidth * (750 / res.windowWidth),
      windowHeight: res.windowHeight * (750 / res.windowWidth) - height,
      statusBarHeight: res.statusBarHeight * (750 / res.windowWidth),
    }
  },
  
  globalData: {
    userInfo: null,
    mobileReg: /^(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\d{8}$/
  },
})