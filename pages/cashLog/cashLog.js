var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();

Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    Id: '',
    BaseList: [],
    pageCount:10,
    page:1,
  },

  onLoad: function (options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
    });

    that.setData({
      Id: options.Id || ''
    })

    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }

    that.init();
  },

  init: function () {
    let that = this;
    shareApi.getShare("/pages/cashLog/cashLog", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    })

    var url = 'user/task/prize/list';
    var params = {
      Year:0,
      Month:0,
      PageCount:that.data.pageCount,
      PageIndex:that.data.page
    };

    netUtil.postRequest(url, params, function (res) {
      res.Data.forEach(item => {
        item.PrizeAmountNow = Number(item.PrizeAmountNow / 100).toFixed(2);
        item.PrizeAmountFinish = Number(item.PrizeAmountFinish / 100).toFixed(2);
      })

      let arr = that.data.BaseList;
      let arr1 = res.Data;
      if(that.data.page==1) {
        arr = arr1
      } else {
        arr = arr.concat(arr1);
      }

      that.setData({
        BaseList: arr
      })
    });
  },

  onReachBottom:function() {
    let temp = this.data.page;
    temp++;
    this.setData({
      page:temp
    })

    this.init();
  },

  onPullDownRefresh:function() {
    this.setData({
      page:1
    })
    
    this.init();
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