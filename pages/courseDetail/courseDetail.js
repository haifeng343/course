Page({

  data: {
    imgUrls: [{
        img: '../../images/banner.png',
        Id: 1
      },
      {
        img: '../../images/banner.png',
        Id: 2
      },
      {
        img: '../../images/banner.png',
        Id: 3
      },
      {
        img: '../../images/banner.png',
        Id: 4
      },
    ],
    autoplay: true, //是否自动播放
    indicatorDots: false, //指示点
    circular: true,
    interval: 5000, //图片切换间隔时间
    duration: 500, //每个图片滑动速度,
    current: 0, //初始化时第一个显示的图片 下标值（从0）index
  },
  swiperChange: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  onLoad: function(options) {

  },
  allTeacher:function() {
    wx.navigateTo({
      url: '/pages/allTeacher/allTeacher',
    })
  },
  onShareAppMessage: function() {

  }
})