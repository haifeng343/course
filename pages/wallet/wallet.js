var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();

Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    money:'',
    popList: [], //弹窗列表
    windowWidth: "",
    closetime: '', //关闭按钮倒计时
  },
  onLoad:function(options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
    });
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare("/pages/wallet/wallet",0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,
      })
    })
    that.selectComponent("#pop").getData("wallet");
  },
  init:function() {

  },
  onShow(){
    let wallet = wx.getStorageSync('wallet');
    this.setData({
      money: wallet? Number(wallet.TotalMoney/100).toFixed(2):0
    })
  },
  Bill:function(){
    wx.navigateTo({
      url: '/pages/bill/bill',
    })
  },
  withdraw:function() {
    wx.navigateTo({
      url: '/pages/withdraw/withdraw',
    })
  },
  cashBack: function () {
    wx.navigateTo({
      url: '/pages/cashBack/cashBack',
    })
  },
  balanceLog:function(){
    wx.navigateTo({
      url: '/pages/ballanceLog/balanceLog',
    })
  },
  bankList:function(){
    wx.navigateTo({
      url: '/pages/bankList/bankList',
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