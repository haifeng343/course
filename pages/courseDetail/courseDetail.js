var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");

const app = getApp();
Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    Id: '', //relId
    List: {},
    Price: '',
    mobile: '',
    teaList: [],
    imgUrls: [],
    autoplay: true, //是否自动播放
    indicatorDots: false, //指示点
    circular: true,
    interval: 5000, //图片切换间隔时间
    duration: 500, //每个图片滑动速度,
    current: 0, //初始化时第一个显示的图片 下标值（从0）index
    type: "", //团单模式
    sheetId: "", //团单Id
    sourceFrom: "", //来源1分类页
    storeId: "", //门店Id
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
    shareApi.getShare("/pages/courseDetail/courseDetail", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,

      })
    })
    that.setData({
      Id: options.Id || "",
      type: options.type || "",
      sheetId: options.sheetId || "",
      sourceFrom: options.sourceFrom || "",
      storeId: options.storeId || ""
    })
    that.init();
    this.selectComponent("#pop").getData('courseDetail');
  },
  //前往购买页面
  goToBuy: function() {
    let that = this;
    let relId = that.data.Id;
    let temp = that.data.storeId.split('NUV');
    if (temp.length != 2) {
      return;
    }
    if (that.data.sourceFrom == 1) {
      wx.redirectTo({
        url: '/pages/chooseClass/chooseClass?Id=' + that.data.sheetId + '&type=' + that.data.type + "&storeId=" + that.data.storeId + '&initGroupId=' + temp[1] + '&initStoreId=' + temp[0] + '&initRelId=' + relId +'&sourceFrom=2'
      })
    } else {
      if (that.data.type == 2) { //商圈模式
        //返回到前两页
        let pages = getCurrentPages();
        let pagesPre2 = pages[pages.length - 3];

        pagesPre2.setData({
          // storeIdGotoTemp: that.data.storeId,
          storeIdGotoTemp: "",
          initGroupId: temp[1],
          initStoreId: temp[0],
          initRelId: relId,
          sourceFrom:1
        });
        pagesPre2.getData(false);
        wx.navigateBack({
          delta: 2
        });
      }
    }
  },
  init: function() {
    this.getData();
  },
  callPhone: function() {
    let that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.mobile,
    })
  },
  getData: function() {
    var that = this;
    var url = 'sheet/item/details';
    var params = {
      Longitude: 0,
      Latitude: 0,
      Id: that.data.Id
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调、
      that.setData({
        List: res.Data,
        mobile: res.Data.Mobile,
        Price: Number(res.Data.Price / 100).toFixed(2),
        teaList: res.Data.TeacherList,
        imgUrls: res.Data.ItemImgList
      })
    }); //调用get方法情就是户数
  },
  swiperChange: function(e) {
    this.setData({
      current: e.detail.current
    })
  },
  allTeacher: function(e) {
    wx.navigateTo({
      url: '/pages/allTeacher/allTeacher?Id=' + e.currentTarget.dataset.id,
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