var app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
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
  onLoad: function (options) {
    this.setData({
      advimg: this.data.imgUrls,
    })
  },
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  onShareAppMessage: function () {

  }

})