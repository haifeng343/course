var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    date: '', //不填写默认今天日期，填写后是默认日期
    dataStart: '', //有效日期
    dataEnd: '', //
    showError: false,
    pagecount: 10,
    page: 1,
    year: '',
    month: '',
    array: [],
    statusdes: '',
    List: [],
    score: '',
    avator: '',
  },
  onShow: function() {
    var date = new Date();
    let arr = [],
      arr1 = [];
    let userInfo = wx.getStorageSync('userInfo');
    let wallet = wx.getStorageSync('wallet');
    this.setData({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      score: wallet.Score,
      avator: userInfo.HeadUrl,
    })
    var year = date.getFullYear();
    arr.push('全部');
    for (var i = year; i > 1970; i--) {
      arr.push(i)
    }
    arr1 = ['全部', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    this.setData({
      array: [arr, arr1],
      now: this.data.month + '月'
    })
    this.getData();
  },
  onLoad: function() {},
  getData: function() {
    let that = this;
    var url = 'user/wallet/change/list';
    var params = {
      Year: that.data.year,
      Month: that.data.month,
      PageCount: that.data.pagecount,
      PageIndex: that.data.page,
      Type: 1
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      let arr = res.Data;
      var arr1 = [];
      if (that.data.page == 1) {
        arr1 = arr;
      } else {
        arr1 = that.data.List;
        arr1 = arr1.concat(res.Data);
      }
      that.setData({
        List: arr1
      })
      wx.hideLoading();
    }, function(msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  bindDateChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    let index = e.detail.value;
    if (index[0] == 0 && index[1] == 0) {
      this.setData({
        date: '全部',
        year: '全部',
        month: '全部',
        page:1
      })
    } else {
      this.setData({
        date: this.data.array[0][index[0]] + '-' + this.data.array[1][index[1]],
        year: this.data.array[0][index[0]],
        month: this.data.array[1][index[1]],
        page: 1
      })
    }
    this.getData();
  },
  showEor: function(e) {
    this.setData({
      statusdes: e.currentTarget.dataset.statusdes,
      showError: true
    })
  },
  closed: function() {
    this.setData({
      showError: false
    })
  },
  withdrawDetail: function() {
    wx.navigateTo({
      url: '/pages/withdrawDetail/withdrawDetail',
    })
  },
  //上拉加载更多
  onReachBottom: function() {
    let that = this;
    wx.showLoading({
      title: '玩命加载中',
    });
    var temp_page = this.data.page;
    temp_page++;
    this.setData({
      page: temp_page
    });
    that.getData();

  },
  //下拉刷新
  onPullDownRefresh: function() {
    wx.showLoading({
      title: "玩命加载中",
    });
    this.setData({
      page: 1
    });
    this.getData();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },
  onShareAppMessage: function() {

  }
})