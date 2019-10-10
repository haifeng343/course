var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    SearchName: '',
    pagecount: 20,
    page: 0,
    List: [],
    wantPage: 0,
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

    that.init();
  },

  init: function () {
    let that = this;
    shareApi.getShare("/pages/inquire/inquire", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    })
  },

  clear: function() {
    this.setData({
      SearchName: '',
    })

    this.clearIfEmpty();
  },

  //搜索的名称
  setSearchName: function (e) {
    this.setData({
      SearchName: e.detail.value
    })

    this.clearIfEmpty();
  },

  clearIfEmpty: function () {
    if (this.data.SearchName == '' || this.data.SearchName == null) {
      this.setData({
        List: []
      })
    }
  },
  
  //点击搜索
  search: function() {
    this._search(1);
  },

  _search: function(PageNum) {
    let that = this;
    if (that.data.SearchName == '') {
      wx.showToast({
        icon: 'none',
        title: "请输入查询内容"
      })
      return;
    }

    if (that.data.wantPage > 0) {
      wx.showToast({
        icon: 'none',
        title: "查询未完成，请慢点~"
      })
      return;
    }

    that.setData({
      wantPage:PageNum,
    });

    var url = 'map/data/search';
    var params = {
      QueryKey: that.data.SearchName,
      PageCount: that.data.pagecount,
      PageIndex: that.data.wantPage,
    }

    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      let arr = that.data.List;
      if (that.data.wantPage == 1) {
        arr = res.Data;
      } else {
        arr.List = arr.List.concat(res.Data.List);
      }

      let curPage = (res.Data.List.length > 0 ? that.data.wantPage : that.data.page);
      that.setData({
        List: arr,
        page: curPage,
        wantPage: 0,
      })

      if (that.data.List.List.length <= 0) {
        wx.showToast({
          icon: 'none',
          title: '暂无相关信息',
        })
      }
    }, function(error) {
      that.setData({
        wantPage: 0,
      })
    })
  },

  onPullDownRefresh: function() {

  },

  onReachBottom: function() {
    this.search(this.data.page + 1);
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