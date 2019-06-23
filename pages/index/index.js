var netUtil = require("../../utils/request.js"); //require引入

const app = getApp();

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    imgUrls:[
      { img:'../../images/banner.png',Id:1},
      { img: '../../images/banner.png', Id: 2 },
      { img: '../../images/banner.png', Id: 3 },
      { img: '../../images/banner.png', Id: 4 },
    ],
    autoplay: true,//是否自动播放
    indicatorDots: false,//指示点
    interval: 5000,//图片切换间隔时间
    duration: 500,//每个图片滑动速度,
    current: 0,//初始化时第一个显示的图片 下标值（从0）index
    color:'#59B8B3',
    bgcolor:'#EDFBFB',
    groupList:[
      {
        imgUrl:'../../images/t1.png',
        title:'家庭烹饪+家庭烹饪+家庭烹饪',
        addr:'西溪商圈',
        distance:'1.0',
        time:'2019-09-30',
        tagList:[
          { tag: '老师认真辅助' },
          { tag: '老师认真辅助' },
        ],
        money:'99',
        integral:'6',
        number:'184'
      }, {
        imgUrl: '../../images/t1.png',
        title: '家庭烹饪+家庭烹饪+家庭烹饪',
        addr: '西溪商圈',
        distance: '1.0',
        time: '2019-09-30',
        tagList: [
          { tag: '老师认真辅助' },
          { tag: '老师认真辅助' },
          { tag: '老师认真辅助' },
        ],
        money: '99',
        integral: '6',
        number: '184'
      },
    ]
  },

  groupDetail:function() {
    wx.navigateTo({
      url: '/pages/groupDetail/groupDetail',
    })
  },
  address:function() {
    wx.navigateTo({
      url: '/pages/selectAddress/selectAddress',
    })
  },
  onShow() {
    var url = 'sheet/details';
    var params = {
      Id: 1
    }

    netUtil.postRequest(url, params, this.onSuccess, this.onFailed); //调用get方法情就是户数
    // wx.request({//小程序官方文档标准请求方法
    //   url: 'https://test.guditech.com/rocketclient/help/api/sheet/details', //仅为示例，并非真实的接口地址
    //   method: 'POST',
    //   data: {
    //     Id: 1
    //   },
    //   header: {
    //     'content-type': 'application/json', // 默认值
    //     'channelCode': 'wechat',
    //     'appVersion': '1.0.1',
    //     'userToken': '',
    //   },
    //   success(res) {
    //     console.log(res.data)
    //   }
    // })
  },
  onLoad: function (options) {
    this.setData({
      advimg: this.data.imgUrls,
    });
  },
  onSuccess: function (res) { //onSuccess成功回调
    wx.hideLoading();
    this.setData({
      jokeList: res.result.data //请求结果数据
    })
  },
  onFailed: function (msg) { //onFailed失败回调
    wx.hideLoading();
    if (msg) {
      wx.showToast({
        title: msg,
      })
    }
  },
  swiperChange: function (e) {//轮播切换
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  onShareAppMessage: function () {

  }

})