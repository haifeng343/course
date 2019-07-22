var netUtil = require("../../utils/request.js"); //require引入
Page({


  data: {
    Id:"",//Id，
    page:1,
    pageCount:20,
    otherList:{},
    teacherList:[],
    TeacherCount:'',
  },
  onLoad: function (options) {
    let that = this;
    that.setData({
      Id: options.Id
    })
    that.getData();
  },
  getData: function () {
    var that = this;
    //获取项目全部师资信息
    var url = 'sheet/item/teachers';
    var params = {
      Longitude: 0,
      Latitude: 0,
      Id: that.data.Id,
      PageCount:that.data.pageCount,
      PageIndex:that.data.page,
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调、
      that.setData({
        otherList: res.Data.SheetItemInfo,
        TeacherCount: res.Data.TeacherCount,
        teacherList: res.Data.TeacherList,
      })
      console.log(that.data.teaList);
    }, function (msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  //上拉刷新
  onReachBottom: function () {
    let that = this;
    that.getData();
  },

  onShareAppMessage: function () {

  }
})