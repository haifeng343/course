var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();

Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    Info: {},
    type:'',
  },
  onShow: function() {
    this.getData();
  },
  init:function() {

  },
  getData: function() {
    let that = this;
    var url = 'user/page/share';
    var params = {}
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      that.setData({
        Info: res.Data
      })
      if (that.data.Info.IsShowShareTitle == true) {
        wx.setNavigationBarTitle({
          title: that.data.Info.ShareTitle,
        })
      }
    }); //调用get方法情就是户数
  },
  onLoad(options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
      type: options.type || ''
    });
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;//我的分享码
    shareApi.getShare("/pages/share/share",0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj1: res.Data,

      })
    });
    shareApi.getShare("myPage").then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj2: res.Data,

      })
    })
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        if (res.model == "iPhone X"){
          that.setData({
            totalTopHeight:68,
            Info:{
              ShareUrlShow: that.data.Info.ShareUrlIphoneXShow
            }
          })
        }
        if (res.model == "iPhone 6") {
          that.setData({
            totalTopHeight: 20,
            Info: {
              ShareUrlShow: that.data.Info.ShareUrlIphone6Show
            }
          })
        }
      },
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