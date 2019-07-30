let app = getApp();
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");

Page({
  data: {
    nearList: [],
    addressList: [],
    ads: "杭州市",
    show: false,
    searchAdr: '', //搜索地址
    items: [],
    address: "定位中...", //定位地址
    longitude: "", //定位精度
    latitude: "", //定位维度
    keyword: '', //搜索keyword
    title: '',
  },
  onLoad: function(options) {
    let hasword = wx.getStorageSync('keyword');
    this.setData({
      keyword: hasword
    })
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
    this.NijieXi(options.Longitude, options.Latitude);
    this.onceAgain();

    this.init();
  },
  init: function() {
    let usertoken = wx.getStorageSync('usertoken');
    if (usertoken) {
      this.getAddressList();
    }
  },
  //clear
  clear: function() {
    this.setData({
      show: false,
      searchAdr: '',
    })
  },
  //我的地址
  getAddressList: function() {
    let that = this;

    var url = 'user/address/list';
    var params = {

    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      // console.log(res);
      that.setData({
        items: res.Data
      })
    },
    null, 
    false, 
    false, 
    false); //调用get方法情就是户数
  },
  //逆解析
  NijieXi: function(longitude, latitude) {
    var that = this;
    var qqmapsdk = new QQMapWX({
      key: 'IDXBZ-GUJCF-2QKJB-NXK2V-VRZXE-MGFUI' // 必填
    });
    //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function(addressRes) {
        var city = addressRes.result.address_component.city;
        that.setData({
          ads: city
        })
        console.log(that.data.ads)
      }
    })
  },
  onceAgain: function() {
    var that = this
    that.setData({
      address: '定位中...',
      longitude: '',
      latitude: '',
    })
    // 实例化腾讯地图API核心类
    var qqmapsdk = new QQMapWX({
      key: 'IDXBZ-GUJCF-2QKJB-NXK2V-VRZXE-MGFUI' // 必填
    });
    //1、获取当前位置坐标
    wx.getLocation({
      type: 'gcj02',
      altitude: true, //高精度定位
      success: function(res) {

        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        });
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(addressRes) {
            var address = addressRes.result.formatted_addresses.recommend;
            var title = addressRes.result.address;
            that.setData({
              address: address,
              title: title
            })
          },
          fail: function() {
            that.setData({
              address: '定位失败',
              longitude: '',
              latitude: '',
            })
          }
        })
      }
    });
    qqmapsdk.search({
      keyword: that.data.keyword,
      success: function(res) {
        that.setData({
          nearList: res.data,
          show: true
        })
      },
      fail: function(res) {
        // console.log(res);
        that.setData({
          show: false
        })
      }
    });
    console.log(that.data.keyword)
  },
  //触发关键词输入提示事件
  getsuggest: function(e) {
    var _this = this;
    // wx.navigateTo({
    //   url: '/pages/searchAddress/searchAddress?name' + _this.data.searchAdr,
    // })
    _this.setData({
      searchAdr: e.detail.value
    })
    if (e.detail.value == "") {
      _this.setData({
        show: false
      })
    } else {
      _this.setData({
        show: true
      })
    }
    var qqmapsdk = new QQMapWX({
      key: 'IDXBZ-GUJCF-2QKJB-NXK2V-VRZXE-MGFUI' // 必填
    });
    //调用关键词提示接口
    qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: _this.data.searchAdr, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      region: _this.data.ads, //设置城市名，限制关键词所示的地域范围，非必填参数
      page_size: 20,
      success: function(res) { //搜索成功后的回调
        console.log(res);
        _this.setData({
          addressList: res.data
        });
        // var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          _this.data.addressList.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            city: res.data[i].city,
            district: res.data[i].district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
          suggestion: _this.data.addressList
        });
      },
      fail: function(error) {
        console.error(error);
      },
    });
  },
  sendAddress: function(e) {
    let pages = getCurrentPages(); //当前页面
    let prevPage = pages[pages.length - 2]; //上一页面
    prevPage.setData({ //直接给上移页面赋值
      address: e.currentTarget.dataset.title,
      InputValue: e.currentTarget.dataset.address,
      lat: e.currentTarget.dataset.lat,
      lng: e.currentTarget.dataset.lng,
    });
    wx.navigateBack({
      delta: 1
    });
  },
  //跳转编辑地址
  adsChange(e) {
    // this.setData({
    //   addr: '../../images/addr.png'
    // })
    let pages = getCurrentPages(); //当前页面
    let prevPage = pages[pages.length - 2]; //上一页面
    prevPage.setData({ //直接给上移页面赋值
      address: e.currentTarget.dataset.address,
      InputValue: e.currentTarget.dataset.title,
      lat: e.currentTarget.dataset.lat,
      lng: e.currentTarget.dataset.lng,
    });
    wx.navigateBack({
      delta: 1
    });
  },
  //跳转城市选择
  cityChange: function() {
    wx.navigateTo({
      url: '/pages/city/city',
    })
  },
  prvent: function() {
    wx.navigateBack({
      changed: true
    });
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