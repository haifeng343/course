let app = getApp();
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');

Page({

  
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    nearList:[],
    ads:"杭州市",
  },
  onLoad: function (options) {
    console.log(options)
    this.onceAgain();
  },
  onceAgain:function() {
    var that = this
    // 实例化腾讯地图API核心类
    var qqmapsdk = new QQMapWX({
      key: 'IDXBZ-GUJCF-2QKJB-NXK2V-VRZXE-MGFUI' // 必填
    });
    //1、获取当前位置坐标
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            var address = addressRes.result.formatted_addresses.recommend;
            console.log(address)
            that.setData({
              address: address
            })
          }
        })
      }
    });
    qqmapsdk.search({
      keyword: '商圈,学校，小区',
      success: function (res) {
        that.setData({
          nearList: res.data,
        })
        // console.log(res);
      },
      fail: function (res) {
        // console.log(res);
      }
    });
  },
  onShow() {
    let that = this;
    wx.getStorage({
      key: 'address',
      success: function(res) {
        that.setData({
          ads: res.data
        })
      },
    })
  },
  //跳转首页
  adsChange(e){
    let { location, title } = e.currentTarget.dataset;
    let a = Object.assign({}, location, { title: title });
    wx.setStorageSync('loc', a);
    wx.switchTab({
      url: '/pages/index/index',
    })
    console.log(e);
  },
  //跳转城市选择
  cityChange:function(){
    wx.navigateTo({
      url: '/pages/city/city',
    })
  },
  prvent:function() {
    wx.navigateBack({ changed: true });
  },
  onShareAppMessage: function () {

  }
})