var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    List:[],
    page:1,
    MyRecommandAccountId:'',
    MyRecommandAccountName:'',
    MyRecommandAccountHeadImgUrl:'',

  },
  onShow:function() {
    this.getData();
  },
  onLoad:function() {
    
  },
  getData: function () {
    let that = this;
    var url = 'user/recommand';
    var params = {
      PageCount: 20,
      PageIndex: that.data.page,
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
    that.setData({
      MyRecommandAccountId: res.Data.MyRecommandAccountId,
      MyRecommandAccountName: res.Data.MyRecommandAccountName,
      MyRecommandAccountHeadImgUrl: res.Data.MyRecommandAccountHeadImgUrl,
    })
      let arr = res.Data.List;
      arr.forEach(item=>{
        // console.log(item)
        item.Amount = Number(item.Amount/100).toFixed(2);
      })
      var arr1 = [];
      if (that.data.page == 1) {
        arr1 = arr;
      } else {
        arr1 = that.data.List;
        arr1 = arr1.concat(res.Data);
      }
      that.setData({
        List: arr1
      })
      wx.hideLoading();
    });
  },
  recommendation:function() {
    wx.navigateTo({
      url: '/pages/recommendation/recommendation',
    })
  },
  //上拉加载更多
  onReachBottom: function () {
    let that = this;
    wx.showLoading({
      title: '玩命加载中',
    });
    var temp_page = this.data.page;
    temp_page++;
    this.setData({
      page: temp_page
    });
    that.getData();

  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showLoading({
      title: "玩命加载中",
    });
    this.setData({
      page: 1
    });
    this.getData();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },
  onShareAppMessage: function () {

  }
})