
var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
Page({

  data: {
    content: {},
    detailCent:{},
    ExtraList:[],
    imgUrls: [],
    text:'',//介绍
    autoplay: true, //是否自动播放
    indicatorDots: false, //指示点
    circular: true,
    interval: 5000, //图片切换间隔时间
    duration: 500, //每个图片滑动速度,
    current: 0, //初始化时第一个显示的图片 下标值（从0）index
    courseList: [],
    color: '#ED8D6D',
    bgcolor: '#FCF4E7',
  },

  onLoad: function (options) {
    var that = this;
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare().then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,

      })
    })
    that.content = options
    var url = 'sheet/details';
    var params = {
      Longitude: that.content.Longitude,
      Latitude: that.content.Latitude,
      Id: that.content.Id
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调、
      var tempList = [];
      for (let index of res.Data.SheetImgList){
        index = index.replace(/\\/, "/");
        tempList.push(index);
      }
      let arr = [];
      that.setData({
        detailCent : res.Data,
        ExtraList: res.Data.ExtraList,
        imgUrls: tempList
      })
      arr = res.Data.GroupList;
      for(let a of arr){
        if (a.MinCount!=0){
            a.text="最多选"+a.MaxCount+'个，最少'+a.MinCount+'个'
        } else if (a.MaxCount >= a.ItemList.length){
            a.text ="以下课程包含全部"
        }else{
            a.text ="以下课程" + a.ItemList.length + '选' + a.MaxCount
        }
      }
      that.setData({ GroupList:arr})
      for (let index of res.Data.SheetImgList) {
        index = index.replace(/\\/, "/");
        tempList.push(index);
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
  init: function () {
    this.getData();
  },
  swiperChangeTo: function (e) {
    this.setData({
      current: e.detail.current,

    })
  },
  chooseClass: function (e) {
    wx.navigateTo({
      url: '/pages/chooseClass/chooseClass?Id='+e.currentTarget.dataset.id,
    })
  },
  courseDetail(e) {
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?Id='+e.currentTarget.dataset.id,
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