var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
Page({

  data: {
    check: 1, //默认选中
    dayStyle: [{
        month: 'current',
        day: new Date().getDate(),
        color: 'white',
        background: '#3CD5D1'
      },
      {
        month: 'current',
        day: new Date().getDate(),
        color: 'white',
        background: '#3CD5D1'
      }
    ],
  },
  onLoad: function(options) {
    let that = this;
    that.init();
    // console.log(new Date().getFullYear() + ',' + (new Date().getMonth() + 1) + ',' + new Date().getDate())
  },
  init: function() {
    let that = this;
    shareApi.getShare("/pages/appointment/appointment", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    })
  },
  checkChange: function(e) {
    console.log(e)
    this.setData({
      check: e.detail.value
    })
  },
  //监听点击下个月
  next: function(e) {
    console.log(e);
  },
  //监听点击上个月
  prev: function(e) {
    console.log(e);
  },
  //监听点击日历标题日期选择
  dateChange: function(e) {
    console.log(e);
  },
  //监听点击日历具体某一天的事件
  dayClick: function(e) {
    console.log(e);
    let clickDay = e.detail.day;
    let changeDay = `dayStyle[1].day`;
    let changeBg = `dayStyle[1].background`;
    this.setData({
      [changeDay]: clickDay,
      [changeBg]: "#84e7d0"
    })
  },
  //选择课程
  classChange: function(e) {

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