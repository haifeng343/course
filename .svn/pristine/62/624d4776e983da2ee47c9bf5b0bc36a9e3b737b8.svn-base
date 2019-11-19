var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({

  data: {
    windowHeight: '',
    windowWidth: '',
    btnTxt: "好友助力",
    content: {},
    showSuccess: false,
    ishelp:false,
  },

  onLoad: function(options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
    });

    that.getData();
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    let recommand = wx.getStorageSync('userInfo').RecommandCode; //我的分享码
    if (recommand == options.recommand) {
      wx.redirectTo({
        url: '/pages/boost/boost',
      })
    } else {
      that._suerIshelp();
    }
    that.init();


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
// 点击如果是自己分享的页面 跳转到分享
  showDialog: function() {
    let that = this;
    let recommand = wx.getStorageSync('recommand');
    var url = 'user/help';
    var params = {
      HelpCode: recommand,
    }
    netUtil.postRequest(url, params, function(res) {
      wx.redirectTo({
        url: '/pages/boostTo/boostTo',
      });
    })
  },
  // onload 获取是否助力过 
  _suerIshelp: function() {
    let that = this;
    let recommand = wx.getStorageSync('recommand');
    var url = 'user/ishelp';
    var params = {
      HelpCode: recommand,
    }
    netUtil.postRequest(url, params, function(res) {
      if (res.Data) {
        if (res.Data.IsHelp == true) {
          wx.redirectTo({
            url: '/pages/boostTo/boostTo',
          });
        }else{
         
        }
      }
    })
  },
  getData: function() {
    let that = this;
    var url = 'page/info';
    var params = {
      Type: 2,
    }
    netUtil.postRequest(url, params, function(res) {
      if (res.Data) {
        that.setData({
          content: JSON.parse(res.Data.Content)
        })
        wx.setNavigationBarTitle({
          title: that.data.content.pageTitle,
        })
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
        console.log(that.data.content)
      }
    })

  },

  clickDec: function() {
    wx.navigateTo({
      url: '/pages/jifen/jifen?title=' + this.data.content.pageTitle + '&content=' + this.data.content.rulesContent,
    })
  },

  bindLog: function() {
    wx.redirectTo({
      url: '/pages/boostLog/boostLog?title=' + this.data.txt1,
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