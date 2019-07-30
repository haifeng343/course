// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");

const app = getApp();

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    Acount: {},
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
    longitude: '',
    latitude: '',
    page: 1,
    pageCount: 20,
    locationAgain: true,
    winWidth: '',
    isLoaded: false,
  },
  onLoad: function(options) {
    var that = this;
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare().then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,
      })
    })

    var res = wx.getSystemInfoSync();
    that.setData({
      winWidth: res.windowWidth
    })

    that.banner();
    that.init();

    that.data.isLoaded = true;
  },
  groupDetail: function(e) {
    const that = this;
    that.Id = parseInt(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/chooseClass/chooseClass?Longitude=' + that.Longitude + '&Latitude=' + that.Latitude + '&Id=' + that.Id,
    })
  },
  address: function() {
    const that = this;
    wx.navigateTo({
      url: '/pages/selectAddress/selectAddress?Longitude=' + that.data.longitude + '&Latitude=' + that.data.latitude
    })
  },
  bindBannerTo: function(e) {
    if (e.currentTarget.dataset.path != '') {
      wx.navigateTo({
        url: '/pages/WebView/WebView?path=' + e.currentTarget.dataset.path,
      })
    }
  },
  swiperChangeTo: function(e) {
    this.setData({
      current: e.detail.current
    })
  },
  searchTo: function() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  banner: function() {
    let that = this;
    var url = 'banner/list';
    var params = {
      BannerCode: 'IndexTop',
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
        that.setData({
          imgUrls: res.Data
        })
      },
      null,
      false,
      false,
      false)
  },

  refreshList: function() {
    let that = this;
    wx.getStorage({
      key: 'loc',
      success: function(res) {
        that.setData({
          longitude: res.data.lng,
          latitude: res.data.lat,
          locationName: res.data.title
        })
      }
    })

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
        locationName: res.Data.LocationName,
        longitude: res.Data.Longitude,
        latitude: res.Data.Latitude
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
      }
    }); //调用get方法情就是户数
  },

  onShow: function() {
    if (!this.data.isLoaded) {
      return;
    }

    let that = this;
    wx.getStorage({
      key: 'loc',
      success: function(res) {
        if (that.data.locationName != res.data.title) {
          that.setData({
            locationName: res.data.title,
            longitude: res.data.lng,
            latitude: res.data.lat
          });

          that.refreshList();
        }
      },
    });
  },
  init: function() {
    let that = this;
    wx.getStorage({
      key: 'loc',
      success: function(res) {
        that.setData({
          locationName: res.data.title,
          longitude: res.data.lng,
          latitude: res.data.lat
        });
      }
    });

    that.getLocation();
  },

  getLocation() {
    var that = this;

    // 实例化腾讯地图API核心类
    var qqmapsdk = new QQMapWX({
      key: 'IDXBZ-GUJCF-2QKJB-NXK2V-VRZXE-MGFUI' // 必填
    });
    wx.getLocation({
      type: 'gcj02',
      altitude: true, //高精度定位
      success: (res) => {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
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

            wx.setStorageSync('loc', {
              lat: that.data.latitude,
              lng: that.data.longitude,
              title: that.data.locationName
            });

            that.refreshList();
          },
        });
      },
      fail: function(res) {
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
                          //授权成功之后，再调用chooseLocation选择地方
                          that.getLocation();
                        } else {
                          that.refreshList();
                        }
                      }
                    })
                  } else {
                    that.refreshList();
                  }
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

            that.refreshList();
          }
        });
      }
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

    that.refreshList();
  },
  //下拉刷新
  onPullDownRefresh: function() {
    this.setData({
      page: 1
    });

    this.refreshList();
    // 停止下拉动作
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