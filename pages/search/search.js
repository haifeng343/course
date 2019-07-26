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
    groupList: [],
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
    this.init();
  },
  init: function () {
    this.getSearch();
  },
  //取本地缓存的搜索历史
  getSearch: function() {
    this.setData({
      searchRecord: wx.getStorageSync('searchRecord') || [], //若无缓存取空
    })

  },
  clear: function() {
    this.setData({
      SearchName: '',
      noShow: false,
      show: true,
      groupList: []
    })
    this.getSearch();
  },
  searchTo: function(e) {
    this.setData({
      SearchName: e.currentTarget.dataset.item.value,
      show: false,
      noShow: true
    })
    this.search();
  },
  //搜索的名称
  setSearchName: function(e) {
    this.setData({
      SearchName: e.detail.value
    })
    if (e.detail.cursor == 0) {
      this.getSearch();
    }
    if (e.detail.value == '' || e.detail.value == null) {
      this.setData({
        show: true,
        noShow: false,
        groupList: []
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
    var url = 'sheet/near/list';
    let inputVal = that.data.SearchName;
    let searchRecord = that.data.searchRecord;
    var params = {
      SearchName: that.data.SearchName,
      Longitude: 0,
      Latitude: 0,
      LocationName: '',
      PageCount: that.data.pagecount,
      PageIndex: that.data.page,
    }
    if (that.data.SearchName == '') {
      wx.showToast({
        icon: 'none',
        title: "请输入搜索内容"
      })
      return;
    }

    for (let item of searchRecord){
      if (item.value == inputVal) {
        var indexTemp = searchRecord.indexOf(item);
        searchRecord.splice(indexTemp, 1);
        break;
      }
    }
  
    if (searchRecord.length > 20) {
      searchRecord.pop()
    }
    searchRecord.unshift({
      value: inputVal,
      id: searchRecord.length
    })
    wx.setStorageSync('searchRecord', searchRecord);

    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      let arr = [];
      wx.setStorageSync('search', that.data.SearchName);
      that.setData({
        groupList: res.Data.List
      })
      if (that.data.SearchName == '') {
        that.setData({
          groupList: []
        })
      }
      if (that.data.groupList.length <= 0) {
        wx.showToast({
          icon: 'none',
          title: '暂无相关信息',
        })
      }
    }, function(msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  //删除历史搜索
  deleteHistory: function() {
    wx.removeStorageSync('searchRecord');
    this.setData({
      searchRecord: []
    })
  },
  //跳转详情页
  groupDetail: function(e) {
    const that = this;
    that.Id = parseInt(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/groupDetail/groupDetail?Longitude=' + that.Longitude + '&Latitude=' + that.Latitude + '&Id=' + that.Id,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

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