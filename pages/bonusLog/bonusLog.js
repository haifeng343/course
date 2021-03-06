var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    date: '', //不填写默认今天日期，填写后是默认日期
    date2: [],
    dataStart: '', //有效日期
    dataEnd: '', //
    showError: false,
    pagecount: 20,
    page: 1,
    year: '全部',
    month: '全部',
    array: [],
    statusdes: '',
    List: [],
  },

  initPicker: function () {
    var date = new Date();
    let arr = [],
      arr1 = [];

    var year = date.getFullYear();
    arr.push('全部');
    for (var i = year; i > 1970; i--) {
      arr.push(i)
    }

    arr1 = ['全部', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    this.setData({
      array: [arr, arr1],
      now: (this.data.year == '全部' && this.data.month == '全部') ? '全部' : (this.data.year + '-' + this.data.month),
      date2: [arr.indexOf(this.data.year), arr1.indexOf(this.data.month + '')],
    })
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

    that.initPicker();
    that.init();
  },

  init: function () {
    let that = this;
    shareApi.getShare("/pages/bonusLog/bonusLog", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    })

    that.getData();
  },

  getData: function () {
    let that = this;
    var url = 'user/bounty/list';
    var params = {
      Year: that.data.year,
      Month: that.data.month,
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

  bindDateChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    let index = e.detail.value;
    if (index[0] == 0 && index[1] == 0) {
      this.setData({
        date: '全部',
        year: '全部',
        month: '全部',
        page: 1
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

  showEor: function (e) {
    this.setData({
      statusdes: e.currentTarget.dataset.statusdes,
      showError: true
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