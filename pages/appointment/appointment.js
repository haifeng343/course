var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const styleArr = [{
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
},
];
Page({

  data: {
    check: 1, //默认选中
    dayStyle: styleArr,
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
    this.setGray();
    
  },
  setGray: function() {
    const data = [
      { month: 10, day: 2 },
      { month: 10, day: 3 },
      { month: 10, day: 4 },
    ]
    let arr = [];
    for (let v of data) {
      if (v.month == new Date().getMonth() + 1) {
        arr.push({
          month: 'current',
          day: v.day,
          color: '#ccc',
        })
      }
    }
    let arr1 = this.data.dayStyle.concat(arr);
    this.setData({ dayStyle: arr1 });
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
    let dd = new Date();
    if (e.detail.currentMonth != (dd.getMonth() + 1) ||
      (e.detail.currentMonth == (dd.getMonth() + 1) && 
      e.detail.currentYear != (dd.getFullYear()))) {
      this.setData({ dayStyle: [] });
    } else {
      this.setData({ dayStyle: styleArr });
    }
  },
  //监听点击上个月
  prev: function(e) {
    console.log(e);
    let dd = new Date();
    if (e.detail.currentMonth != (dd.getMonth() + 1) ||
      (e.detail.currentMonth == (dd.getMonth() + 1) &&
        e.detail.currentYear != (dd.getFullYear()))) {
      this.setData({ dayStyle: [] });
    } else {
      this.setData({ dayStyle: styleArr });
    }
  },
  //监听点击日历标题日期选择
  dateChange: function(e) {
    console.log(e);
    let dd = new Date();
    if (e.detail.currentMonth != (dd.getMonth() + 1) ||
      (e.detail.currentMonth == (dd.getMonth() + 1) &&
        e.detail.currentYear != (dd.getFullYear()))) {
      this.setData({ dayStyle: [] });
    } else {
      this.setData({ dayStyle: styleArr });
    }
    this.setGray();
  },
  //监听点击日历具体某一天的事件
  dayClick: function(e) {
    console.log(e);
    let dd = new Date();
    if (e.detail.month != (dd.getMonth() + 1) ||
      (e.detail.month == (dd.getMonth() + 1) &&
      e.detail.year != (dd.getFullYear()))) {
      this.setData({ dayStyle: [styleArr[0]] });
      let clickDay = e.detail.day;
      let changeDay = `dayStyle[0].day`;
      let changeBg = `dayStyle[0].background`;
      this.setData({
        [changeDay]: clickDay,
        [changeBg]: "#84e7d0"
      })
    } else {
      this.setData({ dayStyle: styleArr });
      let clickDay = e.detail.day;
      let changeDay = `dayStyle[1].day`;
      let changeBg = `dayStyle[1].background`;
      this.setData({
        [changeDay]: clickDay,
        [changeBg]: "#84e7d0"
      })
    }
    const data = [
      { month: 10, day: 2 },
      { month: 10, day: 3 },
      { month: 10, day: 4 },
    ]
    for (let v of data) {
      if (e.detail.day == v.day) {
        wx.showToast({
          title: '1',
        })
      } else {
        continue;
      }
    }
    this.setGray();
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