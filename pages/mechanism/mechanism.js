var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");

const app = getApp();
Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    imgUrls: [],
    autoplay: true, //是否自动播放
    indicatorDots: false, //指示点
    circular: true,
    interval: 5000, //图片切换间隔时间
    duration: 500, //每个图片滑动速度,
    current: 0, //初始化时第一个显示的图片 下标值（从0）index
    storeId: '', //门店ID
    groupId: '', //分组Id
    Info: {},
    type: "", //团单模式
    sheetId: "", //团单Id
    count: 0, //购买数量
    TotalPrice: -1, //总价
    PrizeAmount: 0, //奖励金
    checkedArr: [], //勾选的数组
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
    shareApi.getShare("/pages/mechanism/mechanism", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,

      })
    })
    that.setData({
      storeId: options.storeId || '',
      groupId: options.groupId || '',
      type: options.type || "",
      sheetId: options.sheetId || ""
    })
    that.init();
    that.selectComponent("#pop").getData("mechanism");
  },
  //拨打电话
  call: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile,
    })
  },
  //初始化机构信息
  init: function() {
    let that = this;
    var url = 'sheet/store/details';
    var params = {
      GroupId: that.data.groupId,
      StoreId: that.data.storeId,
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        Info: res.Data
      })
    }, null, false, false, false);
  },
  //跳转购物车
  navtoCar: function() {
    wx.setStorageSync('load', true);
    wx.navigateTo({
      url: '/pages/car/car?type=' + this.data.type,
    });
  },
  //勾选
  checkChange: function(e) {
    var arr = [];
    e.detail.value.forEach(item => {
      arr = arr.concat(item);
    })
    this.setData({
      checkedArr: arr
    });
    this.hasMoney();
  },
  //加入购物车
  addcar: function() {
    var that = this;
    var url = 'cart/add';
    var params = {
      SheetId: that.data.sheetId,
      RelId: that.data.checkedArr,
    }
    netUtil.postRequest(url, params, function(res) {
      that.init(false);
      that.setData({
        TotalPrice: -1,
        count: 0,
      })
      wx.showToast({
        icon: 'none',
        title: '添加已成功'
      })
    });
  },
  //确认预约
  paybtn: function() {
    let checkedList = [];
    checkedList.push({
      SheetId: this.data.sheetId,
      RelId: this.data.checkedArr
    });

    wx.navigateTo({
      url: '/pages/payOrder/payOrder?checkItem=' + JSON.stringify(checkedList) + '&type=' + this.data.type,
    })
  },
  //计算购买价格
  hasMoney: function() {
    var that = this;
    var url = 'sheet/buy/price';
    var params = {
      SheetId: that.data.sheetId,
      RelId: that.data.checkedArr
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调、
        that.setData({
          Remark: res.Data.Remark,
          TotalPrice: res.Data.TotalPrice == -1 ? -1 : res.Data.TotalPrice * 1.0 / 100,
          PrizeAmount: (res.Data.PrizeAmount / 100).toFixed(2),
          VoucherCount: res.Data.VoucherCount,
          count: that.data.checkedArr.length
        })
      },
      '',
      false);
  },
  //跳转课程详情
  courseDetail: function(e) {
    let storeid = this.data.storeId + 'NUV' + this.data.groupId
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?Id=' + e.currentTarget.dataset.id + '&type=' + this.data.type + '&sheetId=' + this.data.sheetId + '&storeId=' + storeid,
    })
  },
  //下拉刷新
  onPullDownRefresh: function() {
    this.init();
    wx.stopPullDownRefresh();
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