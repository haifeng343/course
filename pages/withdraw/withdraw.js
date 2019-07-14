var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSure: false,
    showSuccess: false, //提现申请成功
    bankCardId: '',
    amount: '', //提现金额
    money: '10000', //可提现金额
    show: false,
    showEor: true,
  },
  onShow: function() {

  },
  amoutChange: function(e) {
    if (e.detail.value != '') {
      this.setData({
        show: true,
        showEor: false
      })
    } else {
      this.setData({
        show: false,
        showEor: true
      })
    }
  },
  submitTo: function() {
    this.getData();
  },
  //提现
  getData: function() {
    let that = this;
    var url = 'user/cash/apply';
    var params = {
      BankCardId: that.data.bankCardId,
      Amount: that.data.amount,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      if (res.ErrorCode == 0) {
        this.setData({
          showSure: false,
          showSuccess: true,
        })
      }
    }, function(msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  //点击全部
  all: function() {
    this.setData({
      amount: this.data.money * 1.0 / 100,
      show: true,
      showEor: false
    })
  },
  closeded: function() {
    this.setData({
      showSuccess: false,
    })
  },
  withdrawLog: function() {
    wx.navigateTo({
      url: '/pages/withdrawLog/withdrawLog',
    })
  },
  nohaveTo: function() {
    wx.navigateTo({
      url: '/pages/addBank/addBank',
    })
  },
  onShareAppMessage: function() {

  }
})