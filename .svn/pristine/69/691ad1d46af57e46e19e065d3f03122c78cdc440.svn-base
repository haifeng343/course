var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var netUtil = require("../../utils/request.js"); //require引入
Page({
  data: {
    latitude: '',
    longitude: '',
    markers: [{
      iconPath: "../../images/marks.png",
      id: 0,
      latitude: '',
      longitude: '',
      width: 24,
      height: 40,
      callout: {
        content: '',
        color: '#000',
        fontSize: 14,
        borderRadius: 1,
        padding: '20rpx',
        borderWidth: "100%",
        display: 'ALWAYS',
        borderRadius: '15',
      }
    }],
    address:'',
  },
  onLoad: function(options) {
    let that = this;
    let content = that.data.markers;

    that.reverseLocation(options.Latitude, options.Longitude, 1, function(res) {
    content[0].callout.content=options.name+'\r\n'+res.result.address;
      content[0].latitude = res.result.ad_info.location.lat;
      content[0].longitude = res.result.ad_info.location.lng;
      console.log(that.data.markers)
      that.setData({
        latitude: res.result.ad_info.location.lat,
        longitude: res.result.ad_info.location.lng,
        markers: content,
        address: res.result.address
      })
    }, function(e) {
      console.log(e)
    }, function() {

    });
  },
  regionchange(e) {
    console.log(e.type)
  },
  reverseLocation: function(latitude, longitude, locationType, onsuccess, onfail, oncomplete) {
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
        onsuccess(res);
      },
      fail: function(e) {
        onfail(e);
      },
      complete: function() {
        oncomplete();
      }
    });
  },
  markertap(e) {
    console.log(e)
    let that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        wx.openLocation({
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          scale: 28,
          name: that.data.address, //打开后显示的地址名称
        })
      }
    })
  },
  controltap(e) {
    // wx.openLocation({
    //   latitude: this.data.latitude,
    //   longitude: this.data.longitude,
    //   scale:28,
    //   scale: 28,
    //   name: this.data.markers[0].callout.content, //描述
    //   address: this.data.address  //地址
    // })
    
  }
})