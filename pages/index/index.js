
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var netUtil = require("../../utils/request.js"); //require引入

const app = getApp();

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    Acount: {},
    Latitude: '',
    Longitude: '',
    Id: 0,
    page: 1,
    pages: 0,
    articles: [],
    imgUrls: [{
        img: '../../images/banner.png',
        Id: 1
      },
      {
        img: '../../images/banner.png',
        Id: 2
      },
      {
        img: '../../images/banner.png',
        Id: 3
      },
      {
        img: '../../images/banner.png',
        Id: 4
      },
    ],
    autoplay: true, //是否自动播放
    indicatorDots: false, //指示点
    interval: 5000, //图片切换间隔时间
    duration: 500, //每个图片滑动速度,
    current: 0, //初始化时第一个显示的图片 下标值（从0）index
    color: '#59B8B3',
    bgcolor: '#EDFBFB',
    groupList: [],
    locationName: '',
    page:1,
    pageCount:10,
  },

  groupDetail: function(e) {
    const that = this;
    that.Id = parseInt(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/groupDetail/groupDetail?Longitude=' + that.Longitude + '&Latitude=' + that.Latitude + '&Id=' + that.Id,
    })
  },
  address: function() {
    wx.navigateTo({
      url: '/pages/selectAddress/selectAddress'
    })
  },
  onShow() {
    var _this = this;
    wx.getStorage({
      key: 'loc',
      success: function(res) {
        _this.setData({
          longitude : res.data.lng,
          latitude : res.data.lat,
          locationName: res.data.title.substring(0, 6),
        });
      },
    })
  },
  func:function() {
    let that = this;
    var url = 'sheet/near/list';
    var params = {
      SearchName: '',
      Longitude: that.data.longitude,
      Latitude: that.data.latitude,
      LocationName: that.data.locationName,
      PageCount: that.data.pageCount,
      PageIndex: that.data.page,
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      let arr = res.Data.List;
      for (let index of arr) {
        index.SheetCoverImg = index.SheetCoverImg.replace(/\\/, "/");
      }
      let loc = that.data.locationName;
      if (!loc) {
        loc = res.Data.LocationName;
      }
      that.setData({
        groupList: arr,
        Acount: res.Data,
        locationName: loc
      })
      that.Longitude = res.Data.Longitude;
      that.Latitude = res.Data.Latitude;
    }, function (msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  onLoad: function(options) {
    var that = this
    // 实例化腾讯地图API核心类
    var qqmapsdk = new QQMapWX({
      key: 'IDXBZ-GUJCF-2QKJB-NXK2V-VRZXE-MGFUI' // 必填
    });
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        that.setData({
          latitude: latitude,
          longitude: longitude
        });
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            that.setData({
              locationName: res.result.formatted_addresses.recommend
            })
          }
        });
        this.func();
      }
    })
  },
  swiperChange: function(e) { //轮播切换
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  //下拉刷新
  onReachBottom:function(){
    let that = this;
    wx.showToast({
      icon:'none',
      title: '玩命加载中..',
    })
    // page = that.data.page + 1;
    
  },
  //上拉加载
  onPullDownRefresh:function(){
    this.func(1);
  },
  onShareAppMessage: function() {

  }

})