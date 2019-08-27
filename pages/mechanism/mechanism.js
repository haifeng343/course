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
  },
  onShareAppMessage: function () {

  }
})