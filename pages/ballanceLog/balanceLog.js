// pages/integralLog/integralLog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2019-06', //不填写默认今天日期，填写后是默认日期
  },
  onShow: function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    this.setData({
      date: year + '-' + month
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  onShareAppMessage: function () {

  }
})