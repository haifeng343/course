var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
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
    that.setData({
      Id: options.Id
    })
    this.init();
  },
  init:function() {
    this.getData();
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
    }); //调用get方法情就是户数
  },
  //上拉刷新
  onReachBottom: function () {
    let that = this;
    that.getData();
    wx.stopPullDownRefresh();
  },

  onShareAppMessage: function (res) {
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