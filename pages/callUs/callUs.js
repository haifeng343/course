
var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    List:[],
    Info:{},
  },
  //复制微信号
  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },

  onLoad:function(options){
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
    });

    if (options.recommand) {                                                                                                                           
      wx.setStorageSync("recommand", options.recommand)
    }

    that.init();
  },

  init: function () {
    let that = this;
    shareApi.getShare("/pages/callUs/callUs", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    })

    that.getData();
  },

  getData: function () {
    let that = this;
    var url = 'user/customer/service';
    var params = {
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      console.log(res)
      that.setData({
        List :res.Data.List,
        Info:res.Data
      })
    }); //调用get方法情就是户数
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