var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
Page({

  data: {
    Id:'',//sellid
    List:{},
    Price:'',
    mobile:'',
    teaList:[],
    imgUrls: [],
    autoplay: true, //是否自动播放
    indicatorDots: false, //指示点
    circular: true,
    interval: 5000, //图片切换间隔时间
    duration: 500, //每个图片滑动速度,
    current: 0, //初始化时第一个显示的图片 下标值（从0）index
  }, 
  onLoad:function(options) {
    let that = this;
    if(options.recommand){
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare().then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,

      })
    })
    that.setData({
      Id : options.Id
    })
    that.init();
  },
  init: function () {
    this.getData();
  },
  callPhone:function() {
    let that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.mobile,
    })
  },
  getData:function(){
    var that = this;
    var url = 'sheet/item/details';
    var params = {
      Longitude: 0,
      Latitude: 0,
      Id: that.data.Id
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调、
      that.setData({
        List : res.Data,
        mobile: res.Data.Mobile,
        Price: Number(res.Data.Price/100).toFixed(2),
        teaList: res.Data.TeacherList,
        imgUrls: res.Data.ItemImgList
      })
    }); //调用get方法情就是户数
  },
  swiperChange: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  allTeacher:function(e) {
    wx.navigateTo({
      url: '/pages/allTeacher/allTeacher?Id='+e.currentTarget.dataset.id,
    })
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