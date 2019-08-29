var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
Page({

  data: {
    imgUrls: [],
    autoplay: true, //是否自动播放
    indicatorDots: false, //指示点
    circular: true,
    interval: 5000, //图片切换间隔时间
    duration: 500, //每个图片滑动速度,
    current: 0, //初始化时第一个显示的图片 下标值（从0）index
    storeId: '', //门店ID
    groupId: '', //分组Id
    Info: {},
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
    this.setData({
      storeId: options.storeId || '',
      groupId: options.groupId || '',
    })
    this.init();
  },
  call:function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile,
    })
  },
  init: function() {
    let that = this;
    var url = 'sheet/store/details';
    var params = {
      GroupId: that.data.groupId,
      StoreId: that.data.storeId,
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        Info: res.Data
      })
    },null,false,false,false);
  },
  longtap:function() {
    console.log(564164168541)
  },
  courseDetail:function(e) {
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?Id='+e.currentTarget.dataset.id,
    })
  },
  onPullDownRefresh:function() {
    this.init();
    wx.stopPullDownRefresh();
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