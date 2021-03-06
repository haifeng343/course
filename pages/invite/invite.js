var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    List:[],
    page:1,
    MyRecommandAccountId:'',
    MyRecommandAccountName:'',
    MyRecommandAccountHeadImgUrl:'',
  },

  init: function () {
    let that = this;
    shareApi.getShare("/pages/invite/invite", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
         obj: res.Data
         });
    })

    that.getData();
  },

  onLoad(options) {
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
  
  getData: function() {
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
        item.Amount = Number(item.Amount/100).toFixed(2);
      })
      let arr1 = that.data.List;
      if (that.data.page == 1) {
        arr1 = arr;
      } else {
        arr1 = arr1.concat(arr);
      }

      that.setData({
        List: arr1
      })
    })
  },

  recommendation:function() {
    wx.navigateTo({
      url: '/pages/recommendation/recommendation',
    })
  },

  //上拉加载更多
  onReachBottom: function () {
    let that = this;
    var temp_page = this.data.page;
    temp_page++;
    this.setData({
      page: temp_page
    });

    that.getData();
  },

  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      page: 1
    });

    this.getData();
    // 停止下拉动作
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