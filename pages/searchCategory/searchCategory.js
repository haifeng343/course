var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
Page({


  data: {
    setSearchName: '',
    pageCount: 10,
    page: 1,
    List: [],
    typeId:'',//分类Id
    longitude:'',
    latitude:'',
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
        typeId: options.typeId || '',
        longitude: options.longitude || '',
        latitude: options.latitude || '',
      })
    })
  },
  cheoose:function(e){
    wx.navigateTo({
      url: '/pages/chooseClass/chooseClass?storeId=' + e.currentTarget.dataset.storeid + '&Id=' + e.currentTarget.dataset.id + '&type=' + e.currentTarget.dataset.type + '&relId=' + e.currentTarget.dataset.relid,
    })
  },
  clear: function() {
    this.setData({
      SearchName: '',
    })
  },
  //搜索的名称
  setSearchName: function(e) {
    this.setData({
      SearchName: e.detail.value
    })
  },
  //点击搜索
  search: function() {
    let that = this;
    if(!that.data.SearchName){
      wx.showToast({
        icon:'none',
        title: '请输入查询课程名称',
      })
      return false;
    }
    var url = 'sheet/search/list';
    var params = {
      SearchKey: that.data.SearchName,
      TradingareaId: 0,
      TypeId: 0,
      Longitude: that.data.longitude,
      Latitude: that.data.latitude,
      PageCount: that.data.pageCount,
      PageIndex: that.data.page,
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
      if(arr.length<=0){
        wx.showToast({
          icon:'none',
          title: '暂无查询结果',
        })
      }
    })
  },
  onReachBottom: function() {
    let temp = this.data.page;
    temp++;
    this.setData({
      page: temp
    })
    this.search();
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