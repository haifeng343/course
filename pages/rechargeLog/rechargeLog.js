var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();

Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    showError: false,
    pagecount: 20,
    page: 1,
    array: [],
    List: [],
  },

  onLoad: function (options) {
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
    shareApi.getShare("/pages/rechargeLog/rechargeLog", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    });

    that.getData();
  },

  getData: function () {
    let that = this;
    let url = 'member/recharge/record/list';
    let params = {
      PageCount: that.data.pagecount,
      PageIndex: that.data.page
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      let arr = res.Data;
      let arr1 = [];
      arr.forEach(item => {
        item.PayAmount = Number(item.PayAmount / 100).toFixed(2)
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
    });
  },

  showEor: function (e) {
    wx.showModal({
      title: '失败原因',
      content: e.currentTarget.dataset.statusdes,
      showCancel: false,
      confirmColor: '#3DD6D1',
      confirmText: '知道了'
    })
  },

  closed: function () {
    this.setData({
      showError: false
    })
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