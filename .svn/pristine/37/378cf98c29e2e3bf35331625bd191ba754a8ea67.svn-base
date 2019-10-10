var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");

const app = getApp();
Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    Id: '', //分类id
    name: '', //课程类型
    ImgType: true, //点击全部商圈设置type值
    ImgType1: true, //点击全部分类设置type值
    showId: 0, //默认选中第一个,
    showId1: 0, //默认选中第一个,
    showId2: 0, //默认选中第一个,
    longitude: "", //定位精度
    latitude: "", //定位维度
    city: '', //城市坐标
    typeList: [], //分类列表
    cityList: [], //城市区域列表
    sqList: [], //商圈
    tradingareaId: 0, //选中商圈Id
    typeId: 0, //点击分类Id
    pageCount: 10, //每页条数
    page: 1, //页码数
    List: [], //数据列表
    districtname: '附近', //城市名称
    formId: "",
  },

  onLoad: function(options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
    });

    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }

    let loc = wx.getStorageSync("loc");
    that.setData({
      showId: options.Id || 0,
      typeId: options.Id || 0,
      name: options.name || '全部',
      longitude: options.Longitude || loc.lng,
      latitude: options.Latitude || loc.lat,
      page: 1,
      formId: options.formId || "",
    })

    shareApi.getShare("/pages/category/category", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    })

    that.NijieXi(that.data.longitude, that.data.latitude);
    that.hasTypeList();
    that.hasList();
    that.selectComponent("#pop").getData("category");
  },

  init: function() {

  },

  cheoose: function(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?storeId=' + e.currentTarget.dataset.storeid + '&sheetId=' + e.currentTarget.dataset.id + '&type=' + e.currentTarget.dataset.type + '&Id=' + e.currentTarget.dataset.relid + '&sourceFrom=1' + '&groupId=' + e.currentTarget.dataset.groupid,
    })
  },

  navSheet: function(e) {
    wx.navigateTo({
      url: '/pages/shangquan/shangquan?Id=' + e.currentTarget.dataset.id + '&type=' + e.currentTarget.dataset.type,
    })
  },

  //获取分类列表
  hasTypeList: function() {
    let that = this;
    var url = 'sheet/itemtype/list';
    var params = {
      PageCount: 200,
      PageIndex: 1,
    }

    netUtil.postRequest(url, params, function(res) {
        let arr = res.Data;
        console.log(arr)
        arr.unshift({
          Id: 0,
          ImgUrlShow: '../../images/all.png',
          Name: '全部'
        });
        that.setData({
          typeList: arr,
        })
      },
      null,
      false,
      false,
      false)
  },

  //逆解析
  NijieXi: function(longitude, latitude) {
    var that = this;
    var qqmapsdk = new QQMapWX({
      key: 'SLNBZ-QF5H3-WYD3P-YANNA-SOFVV-RMBUN' // 必填
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
          city: city
        })
        that.hasCityList();
      },
      fail: function(e) {
        that.hasCityList();
      }
    })
  },

  //获取商圈列表
  hasCityList: function() {
    let that = this;
    var url = 'sheet/tradingarea/list';
    var params = {
      City: that.data.city,
    }
    netUtil.postRequest(url, params, function(res) {
        let arr = res.Data;
        let tempArr = {
          District: '附近',
          List: [{
            TradingareaId: 0,
            TradingareaName: "附近(智能范围搜索)"
          }, {
            TradingareaId: -1,
            TradingareaName: "500米"
          }, {
            TradingareaId: -2,
            TradingareaName: "1000米"
          }, {
            TradingareaId: -3,
            TradingareaName: "2000米"
          }, {
            TradingareaId: -4,
            TradingareaName: "5000米"
          }, ]
        };
        arr.unshift(tempArr);
        console.log(tempArr)
        that.setData({
          cityList: arr,
          sqList: arr[0].List,
          txt: tempArr.District,
          districtname: tempArr.District
        })
      },
      null,
      false,
      false,
      false)
  },

  //获取商圈Id
  checkTrading: function(e) {
    console.log(e)
    this.setData({
      showId2: e.currentTarget.dataset.tradingareaid,
      tradingareaId: e.currentTarget.dataset.tradingareaid,
      ImgType1: true,
      page: 1,
    })
    if (this.data.tradingareaId == 0) {
      this.setData({
        txt: this.data.districtname
      })
    } else {
      this.setData({
        txt: e.currentTarget.dataset.name || "附近",
      })
    }
    this.hasList();
  },

  //获取数据列表
  hasList: function() {
    let that = this;
    var url = 'sheet/search/list';
    var params = {
      SearchKey: '',
      TradingareaId: that.data.tradingareaId,
      TypeId: that.data.typeId,
      Longitude: that.data.longitude,
      Latitude: that.data.latitude,
      PageCount: that.data.pageCount,
      PageIndex: that.data.page,
      DistrictName: that.data.districtname,
    }
    netUtil.postRequest(url, params, function(res) {
      res.Data.forEach(item => {
        item.Distance = (parseInt(item.Distance) / 1000).toFixed(1);
      })
      let arr1 = res.Data;
      let arr = that.data.List;
      if (that.data.page == 1) {
        arr = arr1
      } else {
        arr = arr.concat(arr1);
      }
      that.setData({
        List: arr,
      })
    }, null, true, true, true, that.data.formId)
  },

  //商圈切换
  changeType1: function(e) {
    this.setData({
      sqList: this.data.cityList[e.currentTarget.dataset.index].List,
      showId1: e.currentTarget.dataset.index,
      districtname: e.currentTarget.dataset.districtname,
    })
  },

  //点击全部商圈
  allSeller: function() {
    this.setData({
      ImgType: !this.data.ImgType,
      ImgType1: true,
    })
  },

  collapse: function() {
    this.setData({
      ImgType: true,
      ImgType1: true,
    })
  },

  navtoSeller: function(e) {

  },

  navtoClass: function(e) {

  },

  searchTo: function() {
    wx.navigateTo({
      url: '/pages/searchCategory/searchCategory?latitude=' + this.data.latitude + '&longitude=' + this.data.longitude + '&typeId=' + this.data.typeId,
    })
    this.setData({
      ImgType: true,
      ImgType1: true,
    })
  },

  //点击全部商圈里的条件
  changeType: function(e) {
    this.setData({
      ImgType: true,
      showId: e.currentTarget.dataset.id,
      typeId: e.currentTarget.dataset.id,
      name: e.currentTarget.dataset.name,
      page: 1,
    })
    this.hasList();
  },

  allCategory: function() {
    this.setData({
      ImgType1: !this.data.ImgType1,
      ImgType: true,
    })
  },

  onPullDownRefresh: function() {
    this.setData({
      page: 1
    })

    this.hasList();
    wx.stopPullDownRefresh();
  },

  onReachBottom: function() {
    let temp = this.data.page;
    temp++;
    this.setData({
      page: temp
    })
    
    this.hasList();
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