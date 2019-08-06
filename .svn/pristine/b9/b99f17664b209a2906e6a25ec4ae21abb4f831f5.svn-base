var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    html: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare().then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      this.setData({
        obj: res.Data,

      })
    })
    this.init();
  },
  init: function () {
    let that = this;
    var url = 'banner/page/content';
    var params = {
      Code: 'ScoreRules'
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      console.log(res)
      that.setData({
        html: res.Data.Content
      })
    });
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