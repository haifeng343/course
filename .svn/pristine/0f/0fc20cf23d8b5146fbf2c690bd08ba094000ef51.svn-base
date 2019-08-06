let app = getApp();
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');

  // 实例化API核心类
  var qqmapsdk = new QQMapWX({
    key: 'IDXBZ-GUJCF-2QKJB-NXK2V-VRZXE-MGFUI' // 必填
  });
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers:[],
    
  },
  onLoad:function() {
    this.nearby_search();
  },
  // 事件触发，调用接口
  nearby_search: function () {
    var _this = this;
    // 调用接口
    qqmapsdk.search({
      keyword: '学校',  //搜索关键词
      region:"杭州",
      page_size:20,
      location: '30.176286,120.160678',  //设置周边搜索中心点
      success: function (res,data) { //搜索成功后的回调
        console.log(res)
        console.log(data)
        var mks = []
        for (var i = 0; i < res.data.length; i++) {
          mks.push({ // 获取返回结果，放到mks数组中
            title: res.data[i].title,
            id: res.data[i].id,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng,
            iconPath: "../../images/ad1.png", //图标路径
            width: 20,
            height: 20
          })
        }
        _this.setData({ //设置markers属性，将搜索结果显示在地图中
          markers: mks
        })
      },
      fail: function (res) {
      },
      complete: function (res) {
      }
    });
  },
  onShareAppMessage: function () {

  }
})