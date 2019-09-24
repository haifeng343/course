var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    navbarActiveIndex: 0,
    navbarTitle: [
      "未使用",
      "已使用/已过期",
    ],
    showCode: false, //券码弹出框
    modelList: [{
      list: [],
      status: 0, //是否需要刷新0是 1否
      pageIndex: 1,
      navbarActiveIndex: 0
    }, {
      list: [],
      status: 0,
      pageIndex: 1,
      navbarActiveIndex: 1
    }],
  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
    });
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare("/pages/snatch/snatch", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,

      })
    });
    that.init();
  },
  init: function () {
    let usertoken = wx.getStorageSync('usertoken');
    console.log(usertoken)
    this.setData({
      usertoken: usertoken
    });
    if (usertoken) {
      this.getData();
    }
  },
  getData: function () {
    let that = this;
    let tempModelList = that.data.modelList;
    tempModelList[that.data.navbarActiveIndex].status = 1; //设置状态为已刷新
    that.setData({
      modelList: tempModelList
    })
    var url = 'order/list';
    var params = {
      Status: that.data.navbarActiveIndex + 1,
      PageCount: 5,
      PageIndex: that.data.modelList[that.data.navbarActiveIndex].pageIndex,
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      let arr = res.Data;
      let arr1 = [];
      if (tempModelList[that.data.navbarActiveIndex].pageIndex == 1) {
        arr1 = arr;
        tempModelList[that.data.navbarActiveIndex].pageIndex = 1; //设置为第一页
      } else {
        arr1 = tempModelList[that.data.navbarActiveIndex].list;
        arr1 = arr1.concat(arr);
        tempModelList[that.data.navbarActiveIndex].pageIndex = tempModelList[that.data.navbarActiveIndex].pageIndex + 1; //页码加1
      }
      tempModelList[that.data.navbarActiveIndex].list = arr1;
      that.setData({
        modelList: tempModelList
      })
    });
  },
  codeShow: function() {
    this.setData({
      showCode: true
    })
  },
  dialogShow: function() {
    let that = this;
    this.setData({
      showCode: false
    })
  },
  onNavBarTap: function (event) {
    // 获取点击的navbar的index
    let navbarTapIndex = event.currentTarget.dataset.navbarIndex
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    this.setData({
      navbarActiveIndex: navbarTapIndex
    })

    if (this.data.usertoken) {
      if (this.data.modelList[navbarTapIndex].status == 0) {
        this.init();
      }
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    let that = this;
    let temp = that.data.modelList;
    temp[that.data.navbarActiveIndex].pageIndex = 1;
    that.setData({
      modelList: temp
    })
    that.init();
    wx.stopPullDownRefresh();
  },
  //上拉加载更多
  onReachBottom: function () {
    let that = this;
    let temp = that.data.modelList;
    temp[that.data.navbarActiveIndex].pageIndex++;
    that.setData({
      modelList: temp
    })
    that.init();
  },
  onShareAppMessage: function() {

  }
})