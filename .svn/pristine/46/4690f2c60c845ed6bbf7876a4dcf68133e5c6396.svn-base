var shareApi = require("../../utils/share.js");
var netUtil = require("../../utils/request.js"); //require引入
const app = getApp();
Page({

  data: {
    title:'',
    pagecount: 20,
    page: 1,
    List:[
      {
        id:0,
        img:'../../images/invite.png',
        title:'垃圾毒素',
        time:'2010-10-10',
        price:'￥11%',
      }, {
        id: 1,
        img: '../../images/invite.png',
        title: '看上你',
        time: '2020-10-10',
        price: '￥25%',
      }, {
        id: 2,
        img: '../../images/invite.png',
        title: '客户数',
        time: '2010-12-10',
        price: '￥34%',
      }
    ]
  },
  onLoad:function(options) {
    this.setData({
      title: (options.title ? options.title : '助力记录'),
    })

    wx.setNavigationBarTitle({
      title: this.data.title,
    })
    this.init();
  },
  init: function () {
    let that = this;
    shareApi.getShare("/pages/bill/bill").then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    })

    that.getData();
  },
  getData: function () {
    let that = this;
    var url = 'user/help/record/list';
    var params = {
      PageCount: that.data.pagecount,
      PageIndex: that.data.page,
    }

    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      let arr = res.Data;
      var arr1 = [];
      if (that.data.page == 1) {
        arr1 = arr;
      } else {
        arr1 = that.data.List;
        arr1 = arr1.concat(res.Data);
      }

      that.setData({
        List: arr1
      });
    });
  },
  onReachBottom: function () {
    let that = this;
    var temp_page = this.data.page;
    temp_page++;
    this.setData({
      page: temp_page
    });

    that.getData();
  },
  onPullDownRefresh: function () {
    this.setData({
      page: 1
    });

    this.getData();
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