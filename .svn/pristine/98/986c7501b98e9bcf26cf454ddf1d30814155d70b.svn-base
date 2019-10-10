var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({

  data: {
    windowHeight: "",
    windowWidth: "",
    des: 1, //隐藏
    showTop: false, //隐藏分类
    showCode: false, //弹出券码
    ImgShow: '../../images/xia.png', //默认图片
    List:[],//卡券列表
    pagecount:10,
    page:1,
  },

  onLoad: function(options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
    });

    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand);
    }

    that.init();
  },

  //获取我的卡券列表
  init: function() {
    let that = this;
    shareApi.getShare("/pages/kaquan/kaquan", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    }); 

    var url = 'ticket/list';
    var params = {
      TypeId: 0,
      UseStatus: 2,
      PageCount: that.data.pagecount,
      PageIndex: that.data.page,
    }

    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      let arr = res.Data;
      var arr1 = that.data.List;
      if (that.data.page == 1) {
        arr1 = arr;
      } else {
        arr1 = arr1.concat(res.Data);
      }
      
      that.setData({
        List: arr1
      })
    });
  },

  //点击额外信息
  showDesClick: function (e) {
    let index = e.currentTarget.dataset.index;
    let tempArr = this.data.List;
    tempArr[index].check = !tempArr[index].check;
    this.setData({
      List: tempArr
    });

  },
  //上拉加载更多
  onReachBottom: function () {
    let that = this;
    var temp_page = this.data.page;
    temp_page++;
    this.setData({
      page: temp_page
    });
    that.init();

  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      page: 1
    });
    this.init();
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