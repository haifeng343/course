var netUtil = require("../../utils/request.js"); //require引入
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
  onShow: function () {
    
  },
  onLoad: function (options) {
    this.getSearch();
  },
  //取本地缓存的搜索历史
  getSearch: function () {
    this.setData({
      searchRecord: wx.getStorageSync('searchRecord') || [], //若无缓存取空
    })
  },
  clear: function () {
    this.setData({
      SearchName: '',
      noShow: false,
      show: true,
      groupList:[]
    })
    this.getSearch();
  },
  //搜索的名称
  setSearchName: function (e) {
    console.log(e);
    this.setData({
      SearchName: e.detail.value
    })
    if (e.detail.cursor==0){
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
  search: function () {
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
    } else {
      if (searchRecord.length < 20) {
        searchRecord.unshift(
          {
            value: inputVal,
            id: searchRecord.length
          }
        )
      } else {
        searchRecord.pop()
        searchRecord.unshift(
          {
            value: inputVal,
            id: searchRecord.length
          }
        )
      }
      wx.setStorageSync('searchRecord', searchRecord);
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      console.log(res)
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
    }, function (msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  //删除历史搜索
  deleteHistory: function () {
    wx.removeStorageSync('searchRecord');
    this.setData({
      searchRecord: []
    })
  },
  //搜索发现
  setSearchName:function(){
    this.setData({
      
    })
  },
  //跳转详情页
  groupDetail: function (e) {
    const that = this;
    that.Id = parseInt(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/groupDetail/groupDetail?Longitude=' + that.Longitude + '&Latitude=' + that.Latitude + '&Id=' + that.Id,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})