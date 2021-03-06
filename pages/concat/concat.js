var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();

Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    Info: {},
    pageurl: '',
    content: {},
    concat: null,
    isLogin: false
  },

  onLoad(options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
      pageurl: options.fromPageType || ''
    });
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    that.getData();
    that.init();
  },

  init: function() {
    let that = this;
    let recommand = wx.getStorageSync('userInfo').RecommandCode; //我的分享码
    if (recommand) {
      that.setData({
        isLogin: true
      });
    } else {
      that.setData({
        isLogin: false
      });
    }

    shareApi.getShare("/pages/concat/concat", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj1: res.Data,
      })
    });
  },
  gotoLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  _serviceRes: function(name) {
    let that = this;
    var url = 'user/service/res';
    var params = {
      Name: name,
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        concat: res.Data
      })
    })
  },

  getData: function() {
    let that = this;
    var url = 'page/info';
    var params = {
      Type: 4,
      FromPageType: that.data.pageurl,
    }
    netUtil.postRequest(url, params, function(res) {
      if (res.Data) {
        that.setData({
          content: JSON.parse(res.Data.Content)
        })
        that._serviceRes(that.data.content.serviceName);
      }
      wx.getSystemInfo({
        success: function(res) {
          console.log(res)
          let temp = that.data.content;

          if (res.model == "iPhone X") {
            temp.ShowUrl = that.data.content.ShowUrlIphoneX;
            that.setData({
              totalTopHeight: 68,
              content: temp
            })
          }

          if (res.model == "iPhone 6") {
            temp.ShowUrl = that.data.content.ShowUrlIphone6
            that.setData({
              totalTopHeight: 20,
              content: temp
            })
          }
        },
      })

      wx.setNavigationBarTitle({
        title: that.data.content.pageTitle,
      })

    });
  },

  onShareAppMessage: function(res) {
    return {
      title: this.data.obj1.Title,
      path: this.data.obj1.SharePath,
      desc: this.data.obj1.ShareDes,
      imageUrl: this.data.obj1.ShareImgUrl,
      success: (res) => {
        wx.showToast({
          icon: 'none',
          title: '分享成功',
        })
      }
    }
  },
})