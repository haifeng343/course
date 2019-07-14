var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    date: '', //不填写默认今天日期，填写后是默认日期
    dataStart: '', //有效日期
    dataEnd: '', //
    showError: false,
    pagecount:20,
    page:1,
    year:'',
    month:'',
  },
  onShow: function() {
    var date = new Date();
    this.setData({
      year: date.getFullYear(),
      month: date.getMonth() + 1
    })
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    this.setData({
      date: year + '-' + month
    })
  },
  onLoad:function() {
    this.getData();
  },
  getData: function() {
    let that = this;
    var url = 'user/cash/record/list';
    var params = {
      Year: that.data.year,
      Month: that.data.month,
      PageCount:that.data.pagecount,
      PageIndex:that.data.page
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      // console.log(res)
      that.setData({
        List: res.Data
      })
    }, function(msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
    this.getData();
  },
  showEor: function() {
    this.setData({
      showError: true
    })
  },
  closed: function() {
    this.setData({
      showError: false
    })
  },
  withdrawDetail: function() {
    wx.navigateTo({
      url: '/pages/withdrawDetail/withdrawDetail',
    })
  },
  onShareAppMessage: function() {

  }
})