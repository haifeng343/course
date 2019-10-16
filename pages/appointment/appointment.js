var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const todayStyle = [{
  month: 'current',
  day: new Date().getDate(),
  color: 'white',
  background: '#3CD5D1'
}];
//当前总样式
let styleArr = [], tempStyleArr = [];
Page({

  data: {
    year: new Date().getFullYear(),//传递的年
    month: (new Date().getMonth() + 1),//传递的月
    day: new Date().getDate(),//传递的日
    check: 1, //默认选中
    dayStyle: styleArr,
    Id:'',//具体Id
    dayStyle: styleArr, //自定义日期样式
    itemId:'',//课程Id
    storeId:'',//门店Id
    currentMonth:'',//当前月份
    time:'',//时间
    classList:[],//课程列表
    appointmentId:'',//选择的课程
  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      Id:options.Id || '',
      itemId:options.itemId || '',
      storeId: options.storeId || '',
      check: options.type || '',
      time: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
    })
    that.init();
  },
  init: function() {
    let that = this;
    shareApi.getShare("/pages/appointment/appointment", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    })
    if(that.data.check==2){
      that._getDayClass();
    }
    that.setGray();
  },
  setGray: function() {
    const data = [
      // { month: 10, day: 1 },
      // { month: 10, day: 2 },
      // { month: 10, day: 3 },
      // { month: 10, day: 4 },
      // { month: 10, day: 5 },
      // { month: 10, day: 6 },
      // { month: 10, day: 7 },
    ];
      
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
    let that = this;
    that.setData({
      check: e.detail.value
    })
    if (e.detail.value==2){
      that._getDayClass();
    }
  },

  //监听点击下个月
  next: function(e) {
    console.log(e);
    let dd = new Date();
    if (e.detail.currentMonth != (dd.getMonth() + 1) ||
      (e.detail.currentMonth == (dd.getMonth() + 1) && 
      e.detail.currentYear != (dd.getFullYear()))) {
      this.setData({ dayStyle: [], currentMonth: e.detail.currentMonth});
    } else {
      this.setData({ dayStyle: styleArr, currentMonth: e.detail.currentMonth});
    }
    this._resetday();
  },

  //监听点击上个月
  prev: function(e) {
    console.log(e);
    let dd = new Date();
    if (e.detail.currentMonth != (dd.getMonth() + 1) ||
      (e.detail.currentMonth == (dd.getMonth() + 1) &&
        e.detail.currentYear != (dd.getFullYear()))) {
      this.setData({ dayStyle: [], currentMonth: e.detail.currentMonth });
    } else {
      this.setData({ dayStyle: styleArr, currentMonth: e.detail.currentMonth});
    }
    this._resetday();
  },

  //监听点击日历标题日期选择
  dateChange: function(e) {
    console.log(e);
    let dd = new Date();
    if (e.detail.currentMonth != (dd.getMonth() + 1) ||
      (e.detail.currentMonth == (dd.getMonth() + 1) &&
        e.detail.currentYear != (dd.getFullYear()))) {
      this.setData({ dayStyle: [], currentMonth: e.detail.currentMonth });
    } else {
      this.setData({ dayStyle: styleArr, currentMonth: e.detail.currentMonth });
    }
    this.setGray();
    this._resetday();
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
    // const data = [
    //   { month: 10, day: 1 },
    //   { month: 10, day: 2 },
    //   { month: 10, day: 3 },
    //   { month: 10, day: 4 },
    //   { month: 10, day: 5 },
    //   { month: 10, day: 6 },
    //   { month: 10, day: 7 },
    // ]
    // for (let v of data) {
    //   if (e.detail.day == v.day) {
    //     wx.showToast({
    //       icon:"none",
    //       title: '该时间暂无体验课',
    //     })
    //   } else {
    //     continue;
    //   }
    // }
    this.setData({
      time: e.detail.year + '-' + e.detail.month + '-' + e.detail.day
    })
    this.setGray();
    this._getDayClass();
    this._resetday();
  },
  //重置选择课程
  _resetday:function(){
    let that = this;
    that.setData({
      appointmentId:'',
    })
  },
  //获取预约课程表信息
  _getDayClass: function () {
    let that = this;
    var url = 'appointment/item/info';
    var params = {
      StoreId: that.data.storeId,
      ItemId: that.data.itemId,
      ClassDate: that.data.time,
    }
    netUtil.postRequest(url, params, function (res) {
      that.setData({
        classList:res.Data
      })
    }); 
  },
  //选择课程
  classChange: function(e) {
    console.log(e);
    this.setData({
      appointmentId:e.detail.value
    })
  },
  //点击确定
  bindSure:function() {
    let that = this;
    let pages = getCurrentPages();
    let befoPage = pages[pages.length-2];
    let tempArr = that.data.classList;

    let tempName;
  if(that.data.check==2){
    tempArr.forEach(item => {
      if (item.AppointmentId == that.data.appointmentId) {
        tempName = item.ScheduleName
        return;
      }
    })
  }else{
    tempName="与老师协商确定";
  }
    
    befoPage.setData({
      appointmentId:that.data.appointmentId,
      appointmentType:that.data.check,
      somethimg:tempName,
      time: that.data.time
    });
    wx.navigateBack({
      delta:1
    })
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