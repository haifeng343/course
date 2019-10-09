var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();

Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    Id: '', //团单Id
    name: '',
    imgUrls: [],
    autoplay: true, //是否自动播放
    indicatorDots: false, //指示点
    circular: true,
    interval: 5000, //图片切换间隔时间
    duration: 500, //每个图片滑动速度,
    current: 0, //初始化时第一个显示的图片 下标值（从0）index
    type: '', //1团单 2商圈
  },
  
  onLoad(options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
    });

    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }

    that.setData({
      Id: options.Id || '',
      name: options.name || '',
      type: options.type || '',
    })

    that.init();
    that.selectComponent("#pop").getData("choose");
  },

  init: function() {
    let that = this;
    shareApi.getShare("/pages/shangquan/shangquan", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    })

    that.getData();
  },

  getData: function() {
    var that = this;
    var url = 'sheet/details';
    var params = {
      Longitude: that.data.Longitude,
      Latitude: that.data.Latitude,
      Id: that.data.Id
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调、
      let r = res.Data.GroupList;
      that.setData({
        detailCent: res.Data,
        GroupList: res.Data.GroupList,
        imgUrls: res.Data.SheetImgList,
      })
    }, null, true, true, true); //调用get方法情就是户数
  },

  swiperChangeTo: function(e) {
    this.setData({
      current: e.detail.current
    })
  },

  mechanismDetail: function(e) {
    wx.navigateTo({
      url: '/pages/mechanism/mechanism?groupId=' + e.currentTarget.dataset.groupid + '&storeId=' + e.currentTarget.dataset.storeid + '&type=' + this.data.type + '&sheetId=' + this.data.Id
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