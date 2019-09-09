var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    recommandCode: '',
    money: 0,
    score: 0,
    usertoken: "",
    buttons: {},
    IsSalesman: '',
    promptText: true, //是否显示提示语
  },
  //复制微信号
  copyText: function(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  onShow() {
    this.ButtonShow();
    let usertoken = wx.getStorageSync('usertoken');
    let promptText = wx.getStorageSync('promptText');
    this.setData({
      usertoken: usertoken,
      promptText: promptText || ''
    });
    if (usertoken) {
      this.walletd();
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo,
        IsSalesman: userInfo.IsSalesman || '',
        recommandCode: userInfo.RecommandCode || '',
      })
    }
  },
  ButtonShow: function() {
    var that = this;
    var url = 'user/page/show/my'
    var params = {}
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调、
        var temp = {};
        if (res.Data.indexOf("setup") >= 0) {
          temp.setup = true;
        } else {
          temp.setup = false;
        }
        if (res.Data.indexOf("aboutus") >= 0) {
          temp.aboutus = true;
        } else {
          temp.aboutus = false;
        }
        if (res.Data.indexOf("callus") >= 0) {
          temp.callus = true;
        } else {
          temp.callus = false;
        }
        if (res.Data.indexOf("share") >= 0) {
          temp.share = true;
        } else {
          temp.share = false;
        }
        if (res.Data.indexOf("invitation") >= 0) {
          temp.invitation = true;
        } else {
          temp.invitation = false;
        }
        if (res.Data.indexOf("address") >= 0) {
          temp.address = true;
        } else {
          temp.address = false;
        }
        if (res.Data.indexOf("modifyphone") >= 0) {
          temp.modifyphone = true;
        } else {
          temp.modifyphone = false;
        }
        that.setData({
          buttons: temp
        })
        wx.setStorageSync('buttons', temp);
      },
      null,
      false,
      true,
      false
    );
  },
  bindLogin: function() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  aboutUs: function() {
    wx.navigateTo({
      url: '/pages/aboutUs/aboutUs',
    })
  },
  bindIsSalesman: function() {
    wx.navigateTo({
      url: '/pages/map/map',
    })
  },
  bindInquire: function() {
    wx.navigateTo({
      url: '/pages/inquire/inquire'
    })
  },
  walletd: function() {
    let that = this;
    var url = 'user/wallet';
    var params = {}
    netUtil.postRequest(url, params, function(res) {
        that.setData({
          money: Number(res.Data.TotalMoney / 100).toFixed(2),
          score: res.Data.Score
        })
        wx.setStorageSync('wallet', res.Data);
        wx.setStorageSync('userInfo', res.Data);
      },
      null,
      false,
      false,
      false);
  },
  onLoad(options) {
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    wx.setStorageSync('promptText', this.data.promptText);
    var userInfo = wx.getStorageSync('userInfo');
    var recommand = userInfo.RecommandCode;
    shareApi.getShare().then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      this.setData({
        obj: res.Data,
      })
    })
  },
  init: function() {

  },
  integral: function(e) {
    if (this.data.usertoken) {
      wx.navigateTo({
        url: '/pages/integralLog/integralLog',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  callUs: function() {
    wx.navigateTo({
      url: '/pages/callUs/callUs',
    })
  },
  setting: function() {
    if (this.data.usertoken) {
      wx.navigateTo({
        url: '/pages/setting/setting?mobile=' + this.data.userInfo.Mobile + '&ids=' + 1,
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  invite: function() {
    if (this.data.usertoken) {
      wx.navigateTo({
        url: '/pages/invite/invite',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  share: function(e) {
    if (this.data.usertoken) {
      wx.navigateTo({
        url: '/pages/share/share?Id=' + e.currentTarget.dataset.id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  wallet: function() {
    if (this.data.usertoken) {
      wx.navigateTo({
        url: '/pages/wallet/wallet',
      })
      wx.setStorageSync('promptText', false);
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
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
                  netUtil.postRequest(url, params, that.onSuccess); //调用get方法情就是户数
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
      userInfo: res.Data
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