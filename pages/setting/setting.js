var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    windowHeight: app.globalData.windowHeight,
    mobile: '',
    name: '修改手机号',
    ids: 1,
    buttons:{},
  },
  onShow:function() {
    this.setData({
      buttons:wx.getStorageSync('buttons')
    })
    console.log(this.data.buttons)
  },
  onLoad(options) {
    console.log(options)
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare("/pages/setting/setting",0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      this.setData({
        obj: res.Data,

      })
    })
    if (options.mobile) {
      this.setData({
        mobile: options.mobile,
        name: '修改手机号'
      })
    } else {
      this.setData({
        name: '绑定手机号'
      })
    }
  },
  init:function() {

  },
  binding:function() {
    wx.navigateTo({
      url: '/pages/binding/binding?phone=' + this.data.mobile + '&ids=' + 2,
    })
  },
  modify: function() {
    wx.navigateTo({
      url: '/pages/binding/binding?phone=' + this.data.mobile + '&ids=' + this.data.ids,
    })
  },
  exitOut: function() {
    wx.removeStorage({
      key: 'userInfo',
      success: function(res) {
        console.log(res)
      },
    })
    wx.removeStorage({
      key: 'usertoken',
      success: function(res) {
        console.log(res)
      },
    })
  },
  address: function() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: this.data.obj.Title,
      path: this.data.obj.SharePath,
      desc: this.data.obj.ShareDes,
      imageUrl: this.data.obj.ShareImgUrl,
      success: (res) => {
        wx.showToast({
          icon: 'none',
          title: '分享成功',
        })
      }
    }
  },
})