var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
Page({


  data: {
    SearchName: '',
    searchRecord: [],
    pagecount: 20,
    page: 1,
    show: true,
    noShow: false,
    List: [],
  },
  onShow: function() {

  },
  onLoad: function(options) {
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
  },
  init: function () {
    this.search();
  },
  clear: function() {
    this.setData({
      SearchName: '',
      List:[],
    })
  },
  //搜索的名称
  setSearchName: function(e) {
    this.setData({
      SearchName: e.detail.value
    })
    if (e.detail.value == '' || e.detail.value == null) {
      this.setData({
        show: true,
        noShow: false,
        List: []
      })
    } else {
      this.setData({
        show: false,
        noShow: true
      })
    }
  },
  //点击搜索
  search: function() {
    let that = this;
    var url = 'map/data/search';
    var params = {
      QueryKey: that.data.SearchName,
      PageCount: that.data.pagecount,
      PageIndex: that.data.page,
    }
    if (that.data.SearchName == '') {
      wx.showToast({
        icon: 'none',
        title: "请输入查询内容"
      })
      return false;
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      let arr = that.data.List;
      let arr1 = res.Data;
      if (that.data.page == 1) {
        arr = arr1
      } else {
        arr = arr.concat(arr1)
      }
      that.setData({
        List: arr
      })
      if (that.data.List.List.length <= 0) {
        wx.showToast({
          icon: 'none',
          title: '暂无相关信息',
        })
      }
    })
  },

  onPullDownRefresh: function() {

  },

  onReachBottom: function () {
    let temp = this.data.page;
    temp++;
    this.setData({
      page: temp
    })
    this.init();
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