// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");

const app = getApp();

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    Acount: {},
    Latitude: '',
    Longitude: '',
    Id: 0,
    articles: [],
    imgUrls: [],
    autoplay: true, //是否自动播放
    indicatorDots: false, //指示点
    interval: 5000, //图片切换间隔时间
    duration: 500, //每个图片滑动速度,
    circular: true,
    current: 0, //初始化时第一个显示的图片 下标值（从0）index
    color: '#59B8B3',
    bgcolor: '#EDFBFB',
    groupList: [],
    locationName: '正在定位...',
    page: 1,
    pageCount: 20,
    locationAgain: true,
    winWidth:'',
  },
  groupDetail: function(e) {
    const that = this;
    that.Id = parseInt(e.currentTarget.dataset.id)
    wx.navigateTo({
      // url: '/pages/groupDetail/groupDetail?Longitude=' + that.Longitude + '&Latitude=' + that.Latitude + '&Id=' + that.Id,
      url: '/pages/chooseClass/chooseClass?Longitude=' + that.Longitude + '&Latitude=' + that.Latitude + '&Id=' + that.Id,
    })
  },
  address: function() {
    const that = this;
    wx.navigateTo({
      url: '/pages/selectAddress/selectAddress?Longitude=' + that.Longitude + '&Latitude=' + that.Latitude
    })
  },
  bindBannerTo:function(e) {
    if (e.currentTarget.dataset.path!=''){
      wx.navigateTo({
        url: '/pages/WebView/WebView?path=' + e.currentTarget.dataset.path,
      })
    }
  },
  swiperChangeTo:function(e) {
    this.setData({
      current:e.detail.current
    })
  },
  onShow() {
    var _this = this;
    _this.banner();
    wx.getStorage({
      key: 'loc',
      success: function(res) {
        _this.setData({
          longitude: res.data.lng,
          latitude: res.data.lat,
          locationName: res.data.title,
        });
        _this.func();
      },
    });
  },
  searchTo: function() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  banner:function() {
    let that = this;
    var url = 'banner/list';
    var params = {
      BannerCode: 'IndexTop',
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      that.setData({
        imgUrls: res.Data
      })
    })
  },
  func: function() {
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
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
        that.setData({
          locationName: res.Data.LocationName
        })
        let arr = res.Data.List;
        if (arr.length > 0) {
          arr.forEach(item => {
            item.TradingAreaDistance = (parseInt(item.TradingAreaDistance) / 1000).toFixed(1);
          })
          var temp = [];
          if (that.data.page == 1) { //刷新
            temp = arr;
          } else { //加载更多
            temp = that.data.groupList;
            temp = temp.concat(arr);
          }
          let loc = that.data.locationName;
          if (!loc) {
            loc = res.Data.LocationName;
          }
          temp.forEach(item => {
            item.SheetMinPrice = Number(item.SheetMinPrice / 100).toFixed(2);
          })
          that.setData({
            groupList: temp,
            Acount: res.Data,
            locationName: loc
          })
          that.Longitude = res.Data.Longitude;
          that.Latitude = res.Data.Latitude;

        }
        wx.hideLoading();
      },
      function(msg) { //onFailed失败回调
        wx.hideLoading();
        if (msg) {
          wx.showToast({
            title: msg,
          })
        }
      }); //调用get方法情就是户数
  },
  onLoad: function(options) {
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare().then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      this.setData({
        obj: res.Data,

      })
    })
    var res = wx.getSystemInfoSync();
    this.setData({
      winWidth : res.windowWidth
    })
    this.init();
  },
  init: function () {
    this.getLocation();
  },
  getLocation() {
    var that = this
    // 实例化腾讯地图API核心类
    var qqmapsdk = new QQMapWX({
      key: 'IDXBZ-GUJCF-2QKJB-NXK2V-VRZXE-MGFUI' // 必填
    });
    wx.getLocation({
      type: 'gcj02',
      altitude: true, //高精度定位
      success: (res) => {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        that.setData({
          latitude: latitude,
          longitude: longitude,
        });
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(res) {
            that.setData({
              locationName: res.result.formatted_addresses.recommend
            })
            that.func();
          },
        });
      },
      fail: function(res) {
        console.log(res)
        wx.getSetting({
          success: function(res) {
            var statu = res.authSetting;
            if (!statu['scope.userLocation']) {
              wx.showModal({
                title: '请授权当前位置',
                content: '需要获取您的定位信息，否则地理位置将无法获取。',
                success: function(tip) {
                  if (tip.confirm) {
                    wx.openSetting({
                      success: function(data) {
                        if (data.authSetting["scope.userLocation"] === true) {
                          wx.showToast({
                            title: '授权成功',
                            icon: 'success',
                            duration: 1000
                          })
                          //授权成功之后，再调用chooseLocation选择地方
                          that.getLocation();
                        } else {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'success',
                            duration: 1000
                          })
                        }
                      }
                    })
                  }
                  that.func();
                }
              })
            }
          },
          fail: function(res) {
            wx.showToast({
              title: '调用授权窗口失败',
              icon: 'success',
              duration: 1000
            })
          }
        });
      }
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
    that.func();

  },
  //下拉刷新
  onPullDownRefresh: function() {
    wx.showLoading({
      title: "玩命加载中",
    });
    this.setData({
      page: 1
    });
    this.func();
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