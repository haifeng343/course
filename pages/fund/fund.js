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
    startTime:'永久合伙人',

    showLog: false, //转入余额
    showSuccess: false, //转入余额成功
    userInfo: {},

    vip: false,
  },

  onShow:function() {
    let that=this;
    that._getMyInfo();
  },

  onLoad: function(options) {
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

  init: function() {
    let that = this;
    shareApi.getShare("/pages/fund/fund", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    })

    that.getData();
  },

  getData: function() {
    let that = this;
    var url = 'user/wallet/change/list';
    var params = {
      Year: that.data.year,
      Month: that.data.month,
      PageCount: that.data.pagecount,
      PageIndex: that.data.page,
      Type: 3
    }

    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      let arr = res.Data;
      var arr1 = [];
      arr.forEach(item => {
        item.ChangeAmount = Number(item.ChangeAmount / 100).toFixed(2);
      })
      arr.forEach(item => {
        item.ChangeAmountBefore = Number(item.ChangeAmountBefore / 100).toFixed(2);
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

  bindAbout: function() {
    wx.navigateTo({
      url: '/pages/boostTo/boostTo?type=1',
    })
  },

  //上拉加载更多
  onReachBottom: function() {
    let that = this;
    var temp_page = this.data.page;
    temp_page++;
    this.setData({
      page: temp_page
    });

    that.getData();
  },

  //下拉刷新
  onPullDownRefresh: function() {
    this.setData({
      page: 1
    });
    this.getData();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },

  // 点击转入钱包
  transpond: function() {
    let that = this;
    if (that.data.userInfo.FundAmount > 0) {
      wx.showModal({
        title: '请确认转入到钱包￥' + that.data.userInfo.FundAmount,
        success: function (res) {
          if (res.confirm) {
            that.apply();
          }
        }
      })
    }else{
      wx.showToast({
        title: '无效的转入金额',
        icon:'none'
      })
    }
  },

  // 合伙人金额转入钱包
  apply: function() {
    let that = this;
    let url = 'member/fund/to/money';
    let params = {
      Fund: that.data.userInfo.FundAmount,
    }

    netUtil.postRequest(url, params, function(res) {
      that.setData({
        showLog: false,
        showSuccess: true,
      })
      that.init();
      that._getMyInfo();
    });
  },

  _getMyInfo: function() {
    var that = this;
    var url = 'user/wallet';
    var params = {};
    netUtil.postRequest(url, params, function(res) {
      wx.setStorageSync('userInfo', res.Data);
    }, null, false, false, false)
  },

  // 关闭弹窗
  closededs: function() {
    this.setData({
      showSuccess: false
    })
  },

  onShareAppMessage: function(res) {
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