var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();

Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    hiddenmodalput: true,
    code: '',
    Info: {},
    HeadUrl: '',
    NickName: '',
  },

  onLoad(options) {
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

  setCode: function(e) {
    this.setData({
      code: e.detail.value
    })
  },

  getData: function() {
    let that = this;
    var url = 'user/info/byrecommandcode';
    var params = {
      RecommandCode: that.data.code,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      that.setData({
        Info: res.Data,
        HeadUrl: res.Data.HeadUrl,
        NickName: res.Data.NickName,
        hiddenmodalput: false,
      })
    });
  },

  init: function () {
    let that = this;
    shareApi.getShare("/pages/recommendation/recommendation", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    })
  },

  sure: function() {
    this.getData();
  },

  cancelM: function(e) {
    this.setData({
      hiddenmodalput: true,
    })
  },

  confirmM: function(e) {
    let that = this;
    var url = 'user/recommandcode/set';
    var params = {
      RecommandCode: that.data.code,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      let pages = getCurrentPages(); //当前页面
      let prevPage = pages[pages.length - 2]; //上一页面
      let HeadUrl= prevPage.data.MyRecommandAccountHeadImgUrl;
      let NickName = prevPage.data.MyRecommandAccountName;
      prevPage.setData({ //直接给上移页面赋值
        MyRecommandAccountHeadImgUrl: that.data.HeadUrl,
        MyRecommandAccountName: that.data.NickName
      });

      that.setData({
        hiddenmodalput: true,
      })
      
      wx.navigateBack({
        delta: 1
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