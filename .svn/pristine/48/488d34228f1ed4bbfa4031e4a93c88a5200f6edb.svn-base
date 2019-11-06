var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();

Page({
  data: {
    statusBarHeight: '',
    windowHeight: "",
    windowWidth: "",
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    wallet_yuan: '0',
    buttons: {},
    Url: "",
    promptText: true, //是否显示提示语
    noticeList: [{
        content: "国庆假期暂停发货温馨提醒：尊敬的用户，",
      },
      {
        content: "停发货，并停止客服服务，将于10月8日恢复正常",
      },
    ],
  },
  navtoVip:function() {
    wx.navigateTo({
      url: '/pages/vip/vip',
    })
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

  onLoad(options) {
    let that = this;

    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
    });

    that.init();
    that.selectComponent("#pop").getData("mine");
  },

  onShow() {
    let that = this;
    let promptText = wx.getStorageSync('promptText');
    that.setData({
      promptText: promptText || ''
    });

    that._getMyInfo();
    that.menuShow();
  },

  init: function() {
    let that = this;
    shareApi.getShare("/pages/mine/mine", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    });
  },
  _getMyInfo: function() {
    var that = this;
    var url = 'user/wallet';
    var params = {};
    netUtil.postRequest(url, params, function(res) {
      wx.setStorageSync('userInfo', res.Data);

      that.setData({
        userInfo: res.Data,
        wallet_yuan: Number(res.Data.TotalMoney / 100).toFixed(2)
      });
    }, null, false, false, false)
  },
  menuShow: function() {
    var that = this;
    var url = 'user/page/show/my';
    var params = {};
    netUtil.postRequest(url, params, function(res) {
        var temp = {};
        that.setData({
          Url: res.Data.url
        })
        if (res.Data.List.indexOf("setup") >= 0) {
          temp.setup = true;
        } else {
          temp.setup = false;
        }
        if (res.Data.List.indexOf("aboutus") >= 0) {
          temp.aboutus = true;
        } else {
          temp.aboutus = false;
        }
        if (res.Data.List.indexOf("callus") >= 0) {
          temp.callus = true;
        } else {
          temp.callus = false;
        }
        if (res.Data.List.indexOf("share") >= 0) {
          temp.share = true;
        } else {
          temp.share = false;
        }
        if (res.Data.List.indexOf("invitation") >= 0) {
          temp.invitation = true;
        } else {
          temp.invitation = false;
        }
        if (res.Data.List.indexOf("address") >= 0) {
          temp.address = true;
        } else {
          temp.address = false;
        }
        if (res.Data.List.indexOf("modifyphone") >= 0) {
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

  car: function() {
    wx.navigateTo({
      url: '/pages/car/car?type=2',
    })
  },

  integral: function(e) {
    if (this.data.userInfo.UserToken) {
      wx.navigateTo({
        url: '/pages/integralLog/integralLog',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  fuli: function(e) {
    if (this.data.userInfo.UserToken) {
      wx.navigateTo({
        url: '/pages/fuliCenter/fuliCenter',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  quan: function(e) {
    if (this.data.userInfo.UserToken) {
      wx.navigateTo({
        url: '/pages/kaquan/kaquan',
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
    if (this.data.userInfo.UserToken) {
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
    if (this.data.userInfo.UserToken) {
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
    if (this.data.userInfo.UserToken) {
      if (this.data.Url) {
        wx.navigateTo({
          url: '/pages/WebView/WebView?path=' + this.data.Url,
        })
      } else {
        wx.navigateTo({
          url: '/pages/share/share?Id=' + e.currentTarget.dataset.id,
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  wallet: function() {
    if (this.data.userInfo.UserToken) {
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

  subsidy: function() {
    wx.navigateTo({
      url: '/pages/subsidy/subsidy',
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