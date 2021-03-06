var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();

Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    money: '',
    popList: [], //弹窗列表
    windowWidth: "",
    closetime: '', //关闭按钮倒计时
    userInfo:{},
  },

  onLoad: function(options) {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
      userInfo: userInfo
    });

    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }

    that.init();
    that.selectComponent("#pop").getData("wallet");
  },

  init: function() {
    let that = this;
    shareApi.getShare("/pages/wallet/wallet", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    });
  },

  onShow: function() {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      money: (userInfo ? Number(userInfo.TotalMoney / 100).toFixed(2) : 0)
    })
  },

  bindDec: function() {
    let that = this;
    if (that.selectComponent('#dialog')) {
      that.selectComponent('#dialog').init('钱包说明', "WalletRules");
    }
  },
  Bill: function() {
    wx.navigateTo({
      url: '/pages/bill/bill',
    })
  },

  withdraw: function() {
    wx.navigateTo({
      url: '/pages/withdraw/withdraw',
    })
  },

  cashBack: function() {
    wx.navigateTo({
      url: '/pages/cashBack/cashBack',
    })
  },

  // 余额变更记录
  balanceLog: function() {
    wx.navigateTo({
      url: '/pages/ballanceLog/balanceLog',
    })
  },


  // 奖励金
  bous: function() {
    wx.navigateTo({
      url: '/pages/bonusLog/bonusLog',
    })
  },

  bankList: function() {
    wx.navigateTo({
      url: '/pages/bankList/bankList',
    })
  },

  onShareAppMessage: function(res) {
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