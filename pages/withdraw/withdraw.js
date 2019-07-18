var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSure: false,
    showSuccess: false, //提现申请成功
    amount: '', //提现金额
    money: '', //可提现金额
    show: false,
    showEor: true,
    wihdraw: {},
    CardNumber: '',
  },
  onShow: function() {
    let wallet = wx.getStorageSync('wallet');
    this.setData({
      money: Number(wallet.Money / 100).toFixed(2)
    })
  },
  onLoad(options) {
    this.carList();
  },
  changeCard: function(e) {
    wx.navigateTo({
      url: '/pages/bankList/bankList?item=' + e.currentTarget.dataset.item,
    })
  },
  amoutChange: function(e) {
    this.setData({
      amount: e.detail.value
    })
    if(this.data.amount!=''){
      this.setData({
        show:true,
        showEor:false
      })
    }
  },
  toggleDialog: function() {
    this.setData({
      showSure: false
    })
  },
  submitTo: function() {
    this.getData();
  },
  //银行卡列表
  carList: function() {
    let that = this;
    var url = 'user/bank/card/list';
    var params = {

    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      if (res.Data.length >= 1) {
        let wihdraw = res.Data[0];
        that.setData({
          wihdraw: res.Data[0],
          CardNumber: wihdraw.CardNumber.substring(wihdraw.CardNumber.length - 4)
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
  //点击提现
  GetApply: function() {
    this.setData({
      showSure: true,
    })
  },
  //提现
  getData: function() {
    let that = this;
    var url = 'user/cash/apply';
    var params = {
      BankCardId: that.data.wihdraw.BankCardId,
      Amount: that.data.amount * 100,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      that.setData({
        showSure: false,
        showSuccess: true,
        amount: '',
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
  //点击全部
  all: function() {
    this.setData({
      amount: this.data.money,
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