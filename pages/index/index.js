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
    let that = this;
    var url = 'sheet/near/list';
    var params = {
      SearchName: '',
      Longitude: 0,
      Latitude: 0,
      LocationName: '',
      PageCount: 10,
      PageIndex: 1,
    }

    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      that.setData({
        groupList: res.Data.List,
        Acount: res.Data,
      })
      // for (var index in res.Data.List) {
      //   console.log(res.Data.List[index].SheetCoverImg.replace("\\\\", "\/\/"));
      // }
      that.Longitude = res.Data.Longitude;
      that.Latitude = res.Data.Latitude;
    }, function(msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数

  },
  onLoad: function(options) {
    console.log(options);
    this.setData({

    });
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        this.setData({
          latitude: latitude,
          longitude: longitude
        })
      }
    })
  },
  swiperChange: function(e) { //轮播切换
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  onShareAppMessage: function() {

  }

})