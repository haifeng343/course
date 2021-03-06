var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
Page({
  data: {
    Id: '', //具体Id
    itemId: '', //课程Id
    storeId: '', //门店Id
    check: 1, //1与老师协商 2.固定课程
    excludeDateList: [], //排除日期列表
    classList: [], //课程列表
    //弹窗年月参数
    popItem: {
      Year: "",
      Month: ""
    },
    //日期点击参数
    clickItem: {
      Year: "",
      Month: "",
      Day: ""
    },
    checkedAppointmentId: "", //选中课程Id
    dayStyle: [], //默认选中当天日期样式
    excludeStyleArr: [], //无效样式
  },

  onLoad: function(options) {
    let that = this;
    let appointmentType = options.type; //预约类型1.与老师协商 2固定课程
    let storeId = options.storeId;
    let itemId = options.itemId;
    let relId = options.Id;
    that.setData({
      Id: relId,
      storeId: storeId,
      itemId: itemId
    });
    if (appointmentType == 2) {
      let classDate = options.time;
      let appointmentId = options.appointmentId;
      that.setData({
        check: 2
      });
      that.openDateShow(classDate, appointmentId);
    } else {
      that.setData({
        check: 1,
      });
    }
  },
  //预约类型切换
  checkChange: function(e) {
    let that = this;
    that.setData({
      check: e.detail.value
    })
    if (e.detail.value == 2) {
      that.openDateShow(null, 0);
    }
  },
  //打开日历表
  openDateShow(classDate, appointmentId) {
    let that = this;
    let year;
    let month;
    let day;
    if (classDate) {
      let arr = classDate.split('-');
      year = arr[0];
      month = arr[1];
      day = arr[2];
    } else {
      const dd = new Date();
      year = dd.getFullYear();
      month = dd.getMonth() + 1;
      day = dd.getDate();
    }
    that.setData({
      popItem: {
        Year: year,
        Month: month
      },
      clickItem: {
        Year: year,
        Month: month,
        Day: day
      },
      checkedAppointmentId: appointmentId
    })
    that._getExcludeDateList();
  },
  //获取排除日期列表
  _getExcludeDateList: function() {
    let that = this;
    var url = 'appointment/item/date/list';
    var params = {
      StoreId: that.data.storeId,
      ItemId: that.data.itemId,
      Year: that.data.popItem.Year,
      Month: that.data.popItem.Month,
    }
    netUtil.postRequest(url, params, function(res) {
      let excludeDateList = [];
      for (var i = 1; i <= 31; i++) {
        if (res.Data.indexOf(i) == -1) {
          excludeDateList.push(i);
        }
      }
      that.setData({
        excludeDateList: excludeDateList,
        classList: []
      })
      that._setExcludeDateStyle();
    })
  },
  //设置无效日期样式
  _setExcludeDateStyle: function() {
    let that = this;
    let arr = [];
    that.data.excludeDateList.forEach(item => {
      arr.push({
        month: 'current',
        day: item,
        color: '#ccc'
      });
    });
    that.setData({
      excludeStyleArr: arr
    });
    let dd = new Date();
    if (Number(that.data.popItem.Year) == dd.getFullYear() && Number(that.data.popItem.Month) == (dd.getMonth() + 1)) {
      arr.push({
        month: 'current',
        day: dd.getDate(),
        background: '#f4f4f4'
      });
    }
    that.setData({
      dayStyle: arr
    });
    if (that.data.popItem.Year == that.data.clickItem.Year && that.data.popItem.Month == that.data.clickItem.Month) {
      that._getDayClass();
    }
  },
  //获取预约课程表信息
  _getDayClass: function() {
    let that = this;
    let monthTemp = that.data.clickItem.Month;
    let datTemp = that.data.clickItem.Day;

    if (that.data.excludeDateList.indexOf(Number(datTemp)) != -1) {
      return;
    }
    if (that.data.clickItem.Month < 10) {
      monthTemp = '0' + monthTemp;
    }
    if (that.data.clickItem.Day < 10) {
      datTemp = '0' + datTemp;
    }
    var url = 'appointment/item/info';
    var params = {
      StoreId: that.data.storeId,
      ItemId: that.data.itemId,
      ClassDate: that.data.clickItem.Year + '-' + monthTemp + '-' + datTemp,
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        classList: res.Data
      })
      that._setCheckday();
    });
  },
  //设置日期样式
  _setCheckday: function() {
    let that = this;
    let arr = [];
    arr = arr.concat(that.data.excludeStyleArr);
    if (Number(that.data.popItem.Year) == Number(that.data.clickItem.Year) && Number(that.data.popItem.Month) == Number(that.data.clickItem.Month)) {
      arr.push({
        month: 'current',
        day: that.data.clickItem.Day,
        color: '#fff',
        background: '#3CD5D1'
      });
    }
    that.setData({
      dayStyle: arr
    });
  },
  //监听点击下个月
  next: function(e) {
    let that = this;
    that.setData({
      popItem: {
        Year: e.detail.currentYear,
        Month: e.detail.currentMonth
      }
    });
    that._getExcludeDateList();
  },

  //监听点击上个月
  prev: function(e) {
    let that = this;
    that.setData({
      popItem: {
        Year: e.detail.currentYear,
        Month: e.detail.currentMonth
      }
    });
    that._getExcludeDateList();
  },

  //监听点击日历标题日期选择
  dateChange: function(e) {
    let that = this;
    that.setData({
      popItem: {
        Year: e.detail.currentYear,
        Month: e.detail.currentMonth
      }
    });
    that._getExcludeDateList();
  },
  //监听点击日历具体某一天的事件
  dayClick: function(e) {
    let that = this;
    if (that.data.excludeDateList.indexOf(e.detail.day) != -1) {
      return;
    }
    that.setData({
      popItem: {
        Year: e.detail.year,
        Month: e.detail.month,
      },
      clickItem: {
        Year: e.detail.year,
        Month: e.detail.month,
        Day: e.detail.day
      }
    });
    that._getDayClass();
  },
  //选择课程
  classChange: function(e) {
    let that = this;
    that.setData({
      checkedAppointmentId: e.detail.value
    });
  },
  //点击确定
  bindSure: function() {
    let that = this;
    let pages = getCurrentPages();
    let befoPage = pages[pages.length - 2];
    let tempArr = that.data.classList;

    let tempName;
    let timeStr;
    let appointmentId;
    if (that.data.check == 2) {
      tempArr.forEach(item => {
        if (item.AppointmentId == that.data.checkedAppointmentId) {
          tempName = item.ScheduleName
          return;
        }
      })
      let monthStr = that.data.clickItem.Month;
      if (monthStr < 10) {
        monthStr = '0' + monthStr;
      }
      let dayStr = that.data.clickItem.Day;
      if (dayStr < 10) {
        dayStr = '0' + dayStr;
      }
      timeStr= that.data.clickItem.Year + '-' + monthStr + '-' + dayStr;
      appointmentId = that.data.checkedAppointmentId;
    } else {
      tempName = "与老师协商确定";
      timeStr='';
      appointmentId=0;
    }
    befoPage.setData({
      appointmentId: appointmentId,
      appointmentType: that.data.check,
      somethimg: tempName,
      time: timeStr
    });
    wx.navigateBack({
      delta: 1
    })
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