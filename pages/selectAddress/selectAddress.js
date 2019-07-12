let app = getApp();
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    nearList:[],
    addressList:[],
    ads:"杭州市",
    show:false,
    searchAdr:'',//搜索地址
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
      keyword: '商圈',
      success: function (res) {
        that.setData({
          nearList: res.data,
          show:true
        })
        // console.log(res);
      },
      fail: function (res) {
        // console.log(res);
        that.setData({
          show: false
        })
      }
    });
  },
  //触发关键词输入提示事件
  getsuggest: function (e) {
    var _this = this;
    // wx.navigateTo({
    //   url: '/pages/searchAddress/searchAddress?name' + _this.data.searchAdr,
    // })
    _this.setData({
      searchAdr:e.detail.value
    })
    if (e.detail.value==""){
      _this.setData({
        show : false
      })
    }else{
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
      success: function (res) {//搜索成功后的回调
        console.log(res);
        _this.setData({
          addressList:res.data
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
      fail: function (error) {
        console.error(error);
      },
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