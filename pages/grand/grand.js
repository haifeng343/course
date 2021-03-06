var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();

Page({

  data: {
    windowHeight: '',
    windowWidth: "",
    statusBarHeight: '',

    pagecount: 20,
    page: 1,
    year: 0,
    month: 0,
    List: [],
    startTime: '永久合伙人',

    showLog: false, //转入余额
    showSuccess: false, //转入余额成功
    userInfo: {},

    vip: false,
  },

  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    this.setData({
      userInfo: userInfo,
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
      statusBarHeight: app.getGreen(0).statusBarHeight,
    })
    this.init();

  },

  init: function () {
    let that = this;
    shareApi.getShare("/pages/grand/grand", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    })

    that.getData();
  },

  getData: function () {
    let that = this;
    var url = 'user/profit/list';
    var params = {
      PageCount: that.data.pagecount,
      PageIndex: that.data.page,
    }

    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      let arr = res.Data;
      var arr1 = [];
      arr.forEach(item => {
        item.Amount = Number(item.Amount / 100).toFixed(2);
      })
      if (that.data.page == 1) {
        arr1 = arr;
      } else {
        arr1 = that.data.List;
        arr1 = arr1.concat(res.Data);
      }
      that.setData({
        List: arr1
      })
    }); //调用get方法情就是户数
  },

  //上拉加载更多
  onReachBottom: function () {
    let that = this;
    var temp_page = this.data.page;
    temp_page++;
    this.setData({
      page: temp_page
    });
    that.getData();
  },

  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      page: 1
    });
    this.getData();
    // 停止下拉动作
    wx.stopPullDownRefresh();
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