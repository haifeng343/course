var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: '', //提现金额
    money: '', //可提现金额
    wihdraw: {},
    CardNumber: '',
    fee:'',//服务费
    feeMoney:'',//额外扣除
    CashServiceFeeRate:'',
    taskList:[],//任务列表
  },
  onShow: function() {
    let wallet = wx.getStorageSync('wallet');
    let CashServiceFeeRate = wx.getStorageSync('userInfo').CashServiceFeeRate;
    this.setData({
      money: Number(wallet.Money / 100).toFixed(2),
      fee: Number(CashServiceFeeRate/100).toFixed(2),
      CashServiceFeeRate: CashServiceFeeRate
    })
  },
  onLoad(options) {
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare().then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      this.setData({
        obj: res.Data,

      })
    })
    this.init();
  },
  init:function() {
    this.carList();
    this.task();
  },
  clear:function() {
    this.setData({
      amount:''
    })
  },
  changeCard: function(e) {
    wx.navigateTo({
      url: '/pages/bankList/bankList?item=' + e.currentTarget.dataset.item+'&ibd=true',
    })
  },
  amoutChange: function(e) {
    this.doChange(e.detail.value);
  },
  doChange: function(value) {
    this.setData({
      amount: value,
      feeMoney: (Number(value) * this.data.CashServiceFeeRate / 10000).toFixed(2)
    })
  },
  submitTo: function() {
    this.getData();
  },
  //已领取任务列表
  task: function () {
    let that = this;
    var url = 'user/task/list';
    var params = {

    }
    netUtil.postRequest(url, params, function (res) {
      that.setData({
        taskList:res.Data
      })
    }); 
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
      }else{
        that.setData({
          wihdraw:null
        })
      }
    }); //调用get方法情就是户数
  },
  //点击提现
  GetApply: function() {
    let that = this;
    wx.showModal({
      title: '请确认提现￥' + this.data.amount,
      success:function(res) {
        if(res.confirm){
          that.getData();
        }
      }
    })
  },
  //提现
  getData: function() {
    let that = this;
    var url = 'user/cash/apply';
    var params = {
      BankCardId: that.data.wihdraw.BankCardId,
      Amount: Math.floor(that.data.amount * 100),
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      wx.showModal({
        title: '提现成功',
        content: '提现申请成功，等待银行处理' +'\r\n'+'预计 1 个工作日内到账',
        showCancel: false,
        confirmColor: '#3DD6D1',
        confirmText: '知道了',
        success:function(res){
          that.setData({
            amount:''
          })
        }
      })
    }); 
  },
  //点击全部
  all: function() {
    this.doChange(this.data.money);
  },
  withdrawLog: function() {
    wx.navigateTo({
      url: '/pages/withdrawLog/withdrawLog',
    })
  },
  cashLog: function() {
    wx.navigateTo({
      url: '/pages/cashLog/cashLog',
    })
  },
  nohaveTo: function() {
    wx.navigateTo({
      url: '/pages/addBank/addBank',
    })
  },
  onShareAppMessage: function (res) {
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