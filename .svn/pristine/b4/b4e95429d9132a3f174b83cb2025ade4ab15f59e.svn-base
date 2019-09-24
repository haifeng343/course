var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
var setTime;
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    windowHeight: app.globalData.windowHeight,
    windowWidth: app.globalData.windowWidth,
    money:'',
    popList: [], //弹窗列表
    windowWidth: "",
    closetime: '', //关闭按钮倒计时
  },
  onLoad:function(options) {
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare("/pages/wallet/wallet",0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      this.setData({
        obj: res.Data,
      })
    })
  },
  init:function() {

  },
  onShow(){
    let wallet = wx.getStorageSync('wallet');
    this.setData({
      money: wallet? Number(wallet.TotalMoney/100).toFixed(2):0
    })
  },
  // 启动弹窗关闭定时器
  closeInterval: function (closeTime, index) {
    let that = this;
    if (setTime != null) {
      clearInterval(setTime);
    }
    if (closeTime <= 0) {
      return;
    }
    setTime = setInterval(function () {
      let temp = that.data.popList;
      temp[index].pop = false;
      if (temp.length > index + 1) {
        temp[index + 1].pop = true
        closeTime = temp[index + 1].CloseTime;
        index = index + 1;
      } else {
        clearInterval(setTime);
        closeTime = -1;
        index = index + 1;
      }
      that.setData({
        popList: temp
      })
      that.closeInterval(closeTime, index);
    }, closeTime);
  },
  //弹窗列表
  _popList: function () {
    let that = this;
    var url = 'user/pop/list';
    var params = {
      GroupToken: 'wallet',
    }
    netUtil.postRequest(url, params, function (res) {
      let temp = res.Data;
      temp.forEach((item, index) => {
        if (index == 0) {
          item.pop = true;
        } else {
          item.pop = false
        }
      })
      that.setData({
        popList: temp,
      });
      if (temp.length > 0) {
        that.closeInterval(temp[0].CloseTime, 0);
      }
    },
      null,
      false,
      false,
      false)
  },
  //点击弹窗图片事件
  popclick: function (e) {
    console.log(e);
    let actiontype = e.currentTarget.dataset.actiontype;
    let actionparams = e.currentTarget.dataset.actionparams;
    let executeparams = e.currentTarget.dataset.executeparams;
    let index = e.currentTarget.dataset.index;
    let popId = e.currentTarget.dataset.popid;
    if (actionparams == "/pages/index/index" || actionparams == "/pages/order/order" || actionparams == "/pages/mine/mine") {
      wx.switchTab({
        url: actionparams,
      })
    } else {
      if (executeparams == 'receiveTasks') {
        this.receiveTasks(popId, function () {
          if (actiontype == 1) {
            wx.navigateTo({
              url: actionparams,
            })
          } else if (actiontype == 2) {
            wx.navigateTo({
              url: '/pages/WebView/WebView?path=' + actionparams,
            })
          }
        });
      } else {
        if (actiontype == 1) {
          wx.navigateTo({
            url: actionparams,
          })
        } else if (actiontype == 2) {
          wx.navigateTo({
            url: '/pages/WebView/WebView?path=' + actionparams,
          })
        }
      }
    }
    if (actiontype == 1 || actiontype == 2) {
      let temp = this.data.popList;
      temp[index].pop = false;
      if (temp.length > index + 1) {
        temp[index + 1].pop = true
      }
      this.setData({
        popList: temp
      })
    }
  },
  //关闭弹窗按钮
  shutDown: function (e) {
    if (setTime != null) {
      clearInterval(setTime);
    }
    let index = e.currentTarget.dataset.index;
    let temp = this.data.popList;
    temp[index].pop = false;
    if (temp.length > index + 1) {
      temp[index + 1].pop = true;
      this.closeInterval(temp[index + 1].CloseTime, index + 1);
    }
    this.setData({
      popList: temp
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