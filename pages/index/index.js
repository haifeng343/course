// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();

Page({
  data: {
    windowHeight: '',
    windowWidth: "",
    statusBarHeight: '',

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
    locationName: '',
    longitude: '',
    latitude: '',
    page: 1,
    pageCount: 20,
    locationAgain: true,
    isLoaded: false,
    typeList: [], //分类列表
    popList: [], //弹窗列表
    closetime: '', //关闭按钮倒计时
    car: false,
  },

  onLoad: function(options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
      statusBarHeight: app.getGreen(0).statusBarHeight,
    });
    
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand);
    }

    that.banner();
    that.init();
    that.hasTypeList();
    that.data.isLoaded = true;
    if (that.selectComponent('#pop')) {
      that.selectComponent('#pop').getData('index');
    }
  },

  init: function () {
    let that = this;
    let locInfo = wx.getStorageSync('loc');
    that.setData({
        locationName: locInfo.title,
        longitude: locInfo.lng,
        latitude: locInfo.lat
    });
   
    shareApi.getShare("/pages/index/index", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    })

    that.getLocation();
  },

  onShow: function() {
    let that = this;
    if (!that.data.isLoaded) {
      return;
    }

    wx.getStorage({
      key: 'loc',
      success: function (res) {
        if (that.data.locationName != res.data.title) {
          that.setData({
            locationName: res.data.title,
            longitude: res.data.lng,
            latitude: res.data.lat
          });
          
          that.data.page = 1;
          that.refreshList();
        }
      },
    });
  },

  hasTypeList: function() {
    let that = this;
    var url = 'sheet/itemtype/list';
    var params = {
      PageCount: 7,
      PageIndex: 1,
    }
    netUtil.postRequest(url, params, function(res) {
        let arr = res.Data;
        arr.push({
          Id: 0,
          ImgUrlShow: '../../images/all.png',
          Name: '全部'
        });

        that.setData({
          typeList: arr,
        })
      }, null, false, false, false)
  },

  navtoCategory: function(e) {
    let formId = "";
    if (e.detail.formId != "the formId is a mock one") {
      formId = e.detail.formId;
    }
    wx.navigateTo({
      url: '/pages/category/category?Id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name + '&Longitude=' + this.data.longitude + '&Latitude=' + this.data.latitude + '&formId=' + formId,
    })
  },

  //坐标转换
  reverseLocation: function(latitude, longitude, locationType, onsuccess, onfail, oncomplete) {
    if (locationType == 0) {
      onsuccess({
        lat: latitude,
        lng: longitude
      });

      oncomplete();
      return;
    }

    var that = this;
    // 实例化API核心类
    var geocoder = new QQMapWX({
      key: 'SLNBZ-QF5H3-WYD3P-YANNA-SOFVV-RMBUN' // 必填
    });

    // 调用接口
    geocoder.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      coord_type: 3, //baidu经纬度
      success: function(res) {
        onsuccess(res.result.ad_info.location);
      },
      fail: function() {
        onfail();
      },
      complete: function() {
        oncomplete();
      }
    });
  },

  groupDetail: function(e) {
    let that = this;
    that.Id = parseInt(e.currentTarget.dataset.id);
    let type = e.currentTarget.dataset.type;
    if (type == 1) {
      wx.navigateTo({
        url: '/pages/chooseClass/chooseClass?Longitude=' + that.Longitude + '&Latitude=' + that.Latitude + '&Id=' + that.Id + '&name=' + e.currentTarget.dataset.name + '&type=' + e.currentTarget.dataset.type,
      })
    } else {
      wx.navigateTo({
        url: '/pages/shangquan/shangquan?Longitude=' + that.Longitude + '&Latitude=' + that.Latitude + '&Id=' + that.Id + '&name=' + e.currentTarget.dataset.name + '&type=' + e.currentTarget.dataset.type,
      })
    }
  },

  address: function() {
    const that = this;
    wx.navigateTo({
      url: '/pages/selectAddress/selectAddress?Longitude=' + that.data.longitude + '&Latitude=' + that.data.latitude
    })
  },

  bindBannerTo: function(e) {
    if (e.currentTarget.dataset.actiontype == 1) {
      if (e.currentTarget.dataset.path != '') {
        wx.navigateTo({
          url: '/pages/WebView/WebView?path=' + e.currentTarget.dataset.path,
        })
      }
    }

    if (e.currentTarget.dataset.actiontype == 2) {
      if (e.currentTarget.dataset.path != '') {
        wx.navigateTo({
          url: e.currentTarget.dataset.path,
        })
      }
    }
  },

  swiperChangeTo: function(e) {
    this.setData({
      current: e.detail.current
    })
  },

  searchTo: function() {
    wx.navigateTo({
      url: '/pages/searchCategory/searchCategory?latitude=' + this.data.latitude + '&longitude=' + this.data.longitude + '&typeId=0',
    })
  },

  banner: function() {
    let that = this;
    var url = 'banner/list';
    var params = {
      BannerCode: 'IndexTop',
    }

    netUtil.postRequest(url, params, function(res) {
        that.setData({
          imgUrls: res.Data,
        })
      }, null, false, false, false)
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
      let tempRes = res;
      that.reverseLocation(res.Data.Latitude, res.Data.Longitude, res.Data.LocationType, function(res) {
          wx.setStorageSync('loc', {
            lat: res.lat,
            lng: res.lng,
            title: tempRes.Data.LocationName
          });
        },
        function() {
          wx.setStorageSync('loc', {
            lat: tempRes.Data.Latitude,
            lng: tempRes.Data.Longitude,
            title: tempRes.Data.LocationName
          });
        },
        function() {
          let arr = tempRes.Data.List;
          if (arr.length > 0) {
            arr.forEach(item => {
              item.TradingAreaDistance = (parseInt(item.TradingAreaDistance) / 1000).toFixed(1);
              item.SheetMinPrice = Number(item.SheetMinPrice / 100).toFixed(2);
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
              loc = tempRes.Data.LocationName;
            }
            that.setData({
              groupList: temp,
              Acount: tempRes.Data,
              locationName: loc
            })
          }
        });
    }); //调用get方法情就是户数
  },

  getLocation() {
    var that = this;
    // 实例化腾讯地图API核心类
    var qqmapsdk = new QQMapWX({
      key: 'SLNBZ-QF5H3-WYD3P-YANNA-SOFVV-RMBUN' // 必填
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