var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
var setTime;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    windowHeight: app.globalData.windowHeight,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    Info: {},
    recommandCode: '',
    userInfo: {},
  },
  onLoad: function (options) {
    this.setData({
      recommandCode: wx.getStorageSync('recommand'),
    })
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    wx.setStorageSync('promptText', this.data.promptText);
    var userInfo = wx.getStorageSync('userInfo');
    var recommand = userInfo.RecommandCode;
    shareApi.getShare("/pages/login/login",0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      this.setData({
        obj: res.Data,
      })
    })
    let logintype = options.logintype;
    if (logintype == 1) {
      //被动登录
      this._popList("login_bd");
    }else{
      this._popList("login_zd");
    }
  },
  //启动弹窗关闭定时器
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
  _popList: function (loginType) {
    let that = this;
    var url = 'user/pop/list';
    var params = {
      GroupToken: loginType,
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
      }else{
        
      }
    },
      null,
      false,
      false,
      false)
  },
  //点击弹窗图片事件
  popclick: function (e) {
    let that = this;
    console.log(e);
    let actiontype = e.currentTarget.dataset.actiontype;
    let actionparams = e.currentTarget.dataset.actionparams;
    let executeparams = e.currentTarget.dataset.executeparams;
    let index = e.currentTarget.dataset.index;
    let popId = e.currentTarget.dataset.popid;
    if (executeparams == 'receiveTasks') {
      that.receiveTasks(popId, function () {
        if (actiontype == 1) {
          if (actionparams == "/pages/index/index" || actionparams == "/pages/order/order" || actionparams == "/pages/mine/mine") {
            wx.switchTab({
              url: actionparams,
            })
          } else {
            wx.navigateTo({
              url: actionparams,
            })
          }
        } else if (actiontype == 2) {
          wx.navigateTo({
            url: '/pages/WebView/WebView?path=' + actionparams,
          })
        }
        if (actiontype == 1 || actiontype == 2) {
          let temp = that.data.popList;
          temp[index].pop = false;
          if (temp.length > index + 1) {
            temp[index + 1].pop = true
          }
          that.setData({
            popList: temp
          })
        }
      });
    } else {
      if (actiontype == 1) {
        if (actionparams == "/pages/index/index" || actionparams == "/pages/order/order" || actionparams == "/pages/mine/mine") {
          wx.switchTab({
            url: actionparams,
          })
        } else {
          wx.navigateTo({
            url: actionparams,
          })
        }
      } else if (actiontype == 2) {
        wx.navigateTo({
          url: '/pages/WebView/WebView?path=' + actionparams,
        })
      }
      if (actiontype == 1 || actiontype == 2) {
        let temp = that.data.popList;
        temp[index].pop = false;
        if (temp.length > index + 1) {
          temp[index + 1].pop = true
        }
        that.setData({
          popList: temp
        })
      }
    }
  },
  //关闭弹窗按钮
  shutDown: function (e) {
    let that = this;
    if (setTime != null) {
      clearInterval(setTime);
    }
    let index = e.currentTarget.dataset.index;
    let temp = that.data.popList;
    temp[index].pop = false;
    if (temp.length > index + 1) {
      temp[index + 1].pop = true;
      that.closeInterval(temp[index + 1].CloseTime, index + 1);
    }
    that.setData({
      popList: temp
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
                  netUtil.postRequest(url, params, that.onSuccess); //调用get方法情就是户数
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
      if(!res.Data.Mobile){
        wx.redirectTo({
          url: '/pages/gobind/gobind',
        })
      }else{
        wx.setStorageSync('wallet', res.Data);
        var pages = getCurrentPages();
        var beforePage = pages[pages.length - 2];
        beforePage.init();
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