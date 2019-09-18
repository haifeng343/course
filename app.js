const app = getApp();
var netUtil = require("utils/request.js"); //require引入
App({
  // 头部导航栏的高度
  onLaunch: function() {
    var that = this;
    //自定义title设置顶部
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        that.globalData.platform = res.platform
        let totalTopHeight = 68
        if (res.model.indexOf('iPhone X') !== -1) {
          console.log(11111)
          totalTopHeight = 88
        } else if (res.model.indexOf('iPhone') !== -1) {
          totalTopHeight = 64
        }
        that.globalData.windowHeight = res.windowHeight * (750 / res.windowWidth);
        that.globalData.statusBarHeight = res.statusBarHeight * (750 / res.windowWidth)
        that.globalData.titleBarHeight = (totalTopHeight - res.statusBarHeight) * (750 / res.windowWidth)
      },
      failure() {
        that.globalData.statusBarHeight = 0
        that.globalData.titleBarHeight = 0
      }
    })

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

      success: function() { 
      }
    })
  },
  getKeyWord:function() {
    let that = this;
    var url = 'user/place/key';
    var params = {}
    
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      wx.setStorageSync('keyword', res.Data.Keyword)
    },
    null,
    false,
    false,
    false); 
  },
  globalData: {
    userInfo: null
  },
})