// pages/withdrawLog/withdrawLog.js
Page({

  data: {
    date: '', //不填写默认今天日期，填写后是默认日期
    showError:false,
  },
  onShow: function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    this.date = year + '-' + month;
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
  showEor:function(){
    this.setData({
      showError:true
    })
  },
  closed:function(){
    this.setData({
      showError: false
    })
  },
  withdrawDetail:function(){
    wx.navigateTo({
      url: '/pages/withdrawDetail/withdrawDetail',
    })
  },
  onShareAppMessage: function () {

  }
})