var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({

  data: {
    windowHeight: '',
    windowWidth: '',
    content: {},
  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
    });

    that.init();

    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }

  },
  init: function() {
    let that = this;
    that.getData();

    let recommand = wx.getStorageSync('userInfo').RecommandCode; //我的分享码
    shareApi.getShare("/pages/boost/boost", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj1: res.Data,

      })
    });
    shareApi.getShare("helpPage").then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj2: res.Data,

      })
    })
  },
  getData: function() {
    let that = this;
    var url = 'page/info';
    var params = {
      Type: 1,
    }
    netUtil.postRequest(url, params, function(res) {
      if (res.Data) {
        that.setData({
          content: JSON.parse(res.Data.Content)
        })
        wx.setNavigationBarTitle({
          title: that.data.content.pageTitle,
        })
        console.log(that.data.content)
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
      }
    })
  },

  clickDec: function() {
    let that = this;
    wx.navigateTo({
      url: '/pages/jifen/jifen?title=助力规则',
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('getNextPageData', {
          data: that.data.content
        })
      }
    })
  },

  bindLog: function() {
    wx.navigateTo({
      url: '/pages/boostLog/boostLog?title=' + this.data.content.button1Text,
    })
  },

  onShareAppMessage: function(res) {
    if (res.from == 'button') {
      return {
        title: this.data.obj2.Title,
        path: this.data.obj2.SharePath,
        desc: this.data.obj2.ShareDes,
        imageUrl: this.data.obj2.ShareImgUrl,
        success: (res) => {
          wx.showToast({
            icon: 'none',
            title: '分享成功',
          })
        }
      }
    }
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