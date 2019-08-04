var netUtil = require("../../utils/request.js"); //require引入
// 引用百度地图微信小程序JSAPI模块 
var bmap = require('../../utils/bmap-wx.min.js');
var wxMarkerData = [];
var markers_knew = [];
var wxGetData = [];
var timer;
var BMap = new bmap.BMapWX({
  ak: 'gwaVx3IXRfm0NI8xG0wUXdO5vMAN3p86'
});
Page({
  data: {
    markers: [], //标注
    controls: [], //悬浮
    IsGoing: false, //是否钉起来
    //中心点坐标
    centerLocation: {
      longitude: "",
      latitude: ""
    },
    items: [{
        id: '0',
        value: '全部',
        checked: 'true'
      },
      {
        id: '1',
        value: '男'
      },
      {
        id: '2',
        value: '女'
      },
    ],
    //搜索条件
    searchCondition: {
      age: '3-6',
      ageIndex: [3, 6],
      sex: 0, //性别0 全部  1 男 2 女
      range: 2,
    },
    //年龄范围
    array: [],
    //半径列表数据
    array1: ['1公里', '2公里', '3公里', '4公里', '5公里', '6公里', '7公里', '8公里', '9公里', '10公里'],
    address: '', //钉子地址
    //返回的值
    menCount: '',
    totalCount: '',
    womenCount: '',
    titleShow: false, //头部隐藏
    modaleTopShow: true, //悬浮按钮一直显示
    showMol: false, //搜索结果弹窗
    //底部搜索栏显示隐藏
    seachDialog: false,
    uid: '', //uid
    //钉子
    locationMarker: {},
    //悬浮
    control: {},
    //初始位置(我的位置)
    sourceLocation: {
      longitude: "",
      latitude: ""
    },
    //查询结果数据
    resultLocation: {
      longitude: "",
      latitude: "",
      address: '',
      range: '',
      totalCount: '',
      womenCount: '',
      menCount: '',
    },
    //小区查询结果数据
    resultLocation_village: {
      totalCount: '',
      womenCount: '',
      menCount: '',
      village_name: '',
    },
  },
  //点击小区
  makertap: function(e) {
    var id = e.markerId;
    var that = this;
    var url = 'map/search/village'
    var params = {
      VillageUid: wxMarkerData[id].uid,
      Longitude: wxMarkerData[id].longitude,
      Latitude: wxMarkerData[id].latitude,
      AgeStr: that.data.searchCondition.age,
      Sex: that.data.searchCondition.sex,
      Range: that.data.searchCondition.range,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调、
      that.setData({
        resultLocation_village: {
          totalCount: res.Data.TotalCount,
          womenCount: res.Data.WomenCount,
          menCount: res.Data.MenCount,
          village_name: wxMarkerData[id].village_name
        },
        titleShow: true
      })
      if (timer != null) {
        clearInterval(timer);
      }
      timer = setInterval(() => {
        clearInterval(timer);
        that.setData({
          titleShow: false
        })
      }, 10000)

    });
  },
  onLoad: function() {
    var that = this;
    that.getMyLocation(function(res) {
      console.log(res)
      that.setData({
        //设置中心点
        centerLocation: {
          longitude: res.longitude,
          latitude: res.latitude
        },
        //设置我的位置
        sourceLocation: {
          longitude: res.longitude,
          latitude: res.latitude
        },
        //钉子（订下去）初始化
        locationMarker: {
          latitude: res.latitude,
          longitude: res.longitude,
          height: "30",
          alpha: 1,
          iconPath: '../../images/marks.png',
          width: '18',
          id: 99999
        }
      })
    });
    let arr = [],
      arr1 = [];
    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
    arr1 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
    that.setData({
      array: [arr, arr1],
    })
    var res = wx.getSystemInfoSync();
    // console.log(res.windowHeight *0.6)
    that.setData({
      //钉子（浮起来）初始化
      control: {
        id: 99999,
        iconPath: '../../images/marks.png',
        position: {
          left: (res.windowWidth - 18) / 2,
          top: (res.windowHeight - 15) / 2 - 30 * 3 / 4,
          // top: that.data.seachDialog == true ? (res.windowHeight * 0.6 - 15) / 2 - 30 * 3 / 4 : (res.windowHeight - 15) / 2 - 30 * 3 / 4,
          width: 18,
          height: 30
        },
        clickable: true
      }
    });
    that.setData({
      controls: [that.data.control]
    });
  },
  init() {

  },
  //返回中心点
  backToLocation:function(){
    var that=this;
    that.setData({
      //设置中心点
      centerLocation: {
        longitude: that.data.resultLocation.longitude,
        latitude: that.data.resultLocation.latitude
      },
      //设置钉子/悬浮控件位置
      //钉子（订下去）
      locationMarker: {
        latitude: that.data.resultLocation.latitude,
        longitude: that.data.resultLocation.longitude,
        height: "30",
        alpha: 1,
        iconPath: '../../images/marks.png',
        width: '18',
        id: 99999
      }
    });
    if (that.data.controls.length <= 0) {
      var tempMarks = that.data.markers;
      var tempMark=tempMarks.filter(item=>{
        return item.id==99999;
      });
      tempMarks.splice(tempMarks.indexOf(tempMark[0]),1);
      tempMarks.push(that.data.locationMarker);
      that.setData({
        markers: tempMarks
      });
    }
  },
  //搜索
  search: function() {
    var that = this;
    var page_num = 0;
    wxMarkerData = [];
    that._search(page_num, function(res) {
      that.setData({
        markers: wxMarkerData
      });
    });
  },

  _search: function(page_num, onsuccess) {
    var that = this;
    // 发起POI检索请求 
    BMap.search({
      "query": '小区',
      location: that.data.locationMarker.latitude + ',' + that.data.locationMarker.longitude,
      page_size: 20,
      page_num: page_num,
      radius: that.data.searchCondition.range * 1000,
      fail: function(res) {
        console.log(res)
      },
      success: function(data) {
        data.originalData.results.forEach((item, index) => {
          wxMarkerData.push({
            address: item.address,
            alpha: 1,
            height: "25",
            iconPath: "../../images/tg.png",
            iconTapPath: "../../images/tg.png",
            id: index,
            latitude: item.location.lat,
            longitude: item.location.lng,
            telephone: "",
            title: null,
            village_name: item.name,
            width: "25",
            uid: item.uid
          });
        });

        if (data.originalData.results.length >= 20 && page_num < 0) {
          page_num++;
          that._search(page_num, onsuccess);
        } else {
          onsuccess();
        }
      },
      // 此处需要在相应路径放置图片文件 
      iconPath: '../../images/tg.png',
      // 此处需要在相应路径放置图片文件 
      iconTapPath: '../../images/tg.png',
      height: '25',
      width: '25',
    });
  },

  //点击更换图片弹出底部弹窗
  showToast: function() {
    this.setData({
      seachDialog: true
    })
  },
  //点击更换图片收起底部弹窗
  searchLocation: function() {
    this.setData({
      seachDialog: false,
      showMol: false,
      controls: [this.data.control],
      markers: [],
      titleShow: false,
    })
    if (timer != null) {
      clearInterval(timer);
    }
  },
  //性别选择
  radioChange: function(e) {
    this.setData({
      'searchCondition.sex': e.detail.value
    })
  },
  //年龄选择
  bindOldChange: function(e) {
    let index = e.detail.value
    if (index.length == 2) {
      this.setData({
        'searchCondition.age': this.data.array[0][index[0]] + '-' + this.data.array[1][index[1]] + '',
      })
    }
  },
  //半径范围选择
  bindPickerChange: function(e) {
    this.setData({
      'searchCondition.range': e.detail.value
    })
  },
  //点击搜索按钮
  bindSearch: function() {
    let that = this;
    var url = 'map/search';
    var params = {
      Longitude: that.data.locationMarker.longitude,
      Latitude: that.data.locationMarker.latitude,
      AgeStr: that.data.searchCondition.age,
      Sex: that.data.searchCondition.sex,
      Range: parseInt(that.data.searchCondition.range) + 1,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      console.log(res);
      that.setData({
        resultLocation: {
          longitude: that.data.locationMarker.longitude,
          latitude: that.data.locationMarker.latitude,
          address: that.data.address,
          range: parseInt(that.data.range) + 1,
          totalCount: res.Data.TotalCount,
          womenCount: res.Data.WomenCount,
          menCount: res.Data.MenCount,
        },
        showMol: true,
      })
      that.search();
    });
  },
  //返回搜索结果
  returnSearch: function() {
    this.setData({
      showMol: false,
    })
  },
  //标记的位置（设置中心位置）
  bindregionchange: function(e) {
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
      var that = this;
      this.mapCtx = wx.createMapContext("map");
      this.mapCtx.getCenterLocation({
        type: 'gcj02',
        success: function(res) {
          if (that.data.controls.length > 0) {
            that.setData({
              centerLocation: {
                latitude: res.latitude,
                longitude: res.longitude
              },
              //钉子（订下去）
              locationMarker: {
                latitude: res.latitude,
                longitude: res.longitude,
                height: "30",
                alpha: 1,
                iconPath: '../../images/marks.png',
                width: '18',
                id: 99999
              }
            });
            // 发起regeocoding检索请求 
            BMap.regeocoding({
              location: that.data.centerLocation.latitude + ',' + that.data.centerLocation.longitude,
              fail: function(res) {
                // console.log(res)
              },
              success: function(res) {
                that.setData({
                  address: res.originalData.result.formatted_address
                })
              },
            });
          }
        }
      });
    }
  },
  //找回初始位置（回到我的位置）
  findLocation: function() {
    var that = this;
    that.getMyLocation(function(res) {
      that.setData({
        //设置中心点
        centerLocation: {
          longitude: res.longitude,
          latitude: res.latitude
        },
        //设置我的位置
        sourceLocation: {
          longitude: res.longitude,
          latitude: res.latitude
        },
      });
    });
    if (that.data.controls.length > 0) {
      that.setData({
        //钉子（订下去）
        locationMarker: {
          latitude: this.data.sourceLocation.latitude,
          longitude: this.data.sourceLocation.longitude,
          height: "30",
          alpha: 1,
          iconPath: '../../images/marks.png',
          width: '18',
          id: 99999
        }
      });

      // 发起regeocoding检索请求 
      BMap.regeocoding({
        location: that.data.sourceLocation.latitude + ',' + that.data.sourceLocation.longitude,
        fail: function(res) {
          console.log(res)
        },
        success: function(res) {
          console.log(res)
          that.setData({
            address: res.originalData.result.formatted_address
          })
        },
      });
    }
  },
  //获取我的定位
  getMyLocation: function(onSuccess) {
    var that = this;
    //获取当前位置
    wx.getLocation({
      type: 'gcj02',
      altitude: true, //高精度定位
      success(res) {
        onSuccess({
          longitude: res.longitude,
          latitude: res.latitude,
          address: ""
        });
      },
      fail(error) {
        let location = wx.getStorageSync('loc');
        console.log(location)
        onSuccess({
          longitude: location.lng,
          latitude: location.lat,
          address: location.title
        });
      }
    });
  },
  //找回上个位置（钉子顶起来/浮起来）
  findLastPosition: function() {
    var temp = this.data.markers;
    if (this.data.IsGoing) { //浮起来
      var index = temp.indexOf(this.data.locationMarker);
      console.log(index)
      temp.splice(index, 1);
      var centerLocation = {
        longitude: this.data.locationMarker.longitude,
        latitude: this.data.locationMarker.latitude
      };
      this.setData({
        centerLocation: centerLocation,
        controls: [this.data.control],
        markers: temp,
        IsGoing: false
      });
    } else { //钉起来
      var locationMarker = this.data.locationMarker;
      locationMarker.longitude = this.data.centerLocation.longitude;
      locationMarker.latitude = this.data.centerLocation.latitude;
      this.setData({
        locationMarker: locationMarker
      });
      temp.push(this.data.locationMarker);
      this.setData({
        markers: temp,
        controls: [],
        IsGoing: true,
      });
      let that = this;
      // 发起regeocoding检索请求 
      BMap.regeocoding({
        location: that.data.locationMarker.latitude + ',' + that.data.locationMarker.longitude,
        fail: function(res) {
          console.log(res)
        },
        success: function(res) {
          console.log(res)
          that.setData({
            address: res.originalData.result.formatted_address
          })
        },
      });
    }
  },
})