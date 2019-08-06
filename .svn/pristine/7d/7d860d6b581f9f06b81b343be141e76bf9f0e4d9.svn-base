var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
Page({


  data: {
    hiddenmodalput: true,
    code: '',
    Info: {},
    HeadUrl: '',
    NickName: '',
  },
  onLoad(options) {
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
   
  },
  sure: function() {
    this.getData();
    // this.setData({
    //   hiddenmodalput: false,
    // })
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