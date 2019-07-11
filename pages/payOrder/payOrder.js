var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    checked: false,
    Id: "",
    relId: [],
    ItemList:[],
    TotalAmount:"",
    TotalScore:"",
    UseScore:"",
    UseScoreAmount:"",
    OrderId:'',
  },
  onLoad(options) {
    let that = this;
    let arr = [];
    arr.push(options.ids);
    that.setData({
      Id: options.Id,
      relId: arr,
    })
    this.getData();
  },
  getData: function () {
    var that = this;
    var url = 'sheet/buy/details'
    var params = {
      SheetId: that.data.Id,
      RelId: that.data.relId
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调、
      console.log(res)
      that.setData({
        ItemList:res.Data.ItemList,
        TotalAmount: res.Data.TotalAmount*1.0/100,
        TotalScore: res.Data.TotalScore * 1.0 / 100,
        UseScore: res.Data.UseScore * 1.0 / 100,
        UseScoreAmount: res.Data.UseScoreAmount * 1.0 / 100,
      })
    }, function (msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  swich: function () {
    var checked = this.data.checked;
    this.setData({
      "checked": !checked
    })
  },
  oderPay:function(){
    var that = this;
    var url = 'order/pay'
    var params = {
      OrderId: that.data.OrderId,
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调、
      console.log(res)
      that.setData({
        
      })
    }, function (msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  paySure: function () {
    var that = this;
    var url = 'order/create'
    var params = {
      SheetId: that.data.Id,
      RelId: that.data.relId,
      UseScore: that.data.checked,
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调、
      console.log(res)
      that.setData({
       OrderId:res.Data.OrderId
      })
      that.oderPay();
      wx.requestPayment({
        timeStamp: '',
        nonceStr: '',
        package: 'prepay_id=',
        signType: '',
        paySign: '',
        'success': function (res) { },
        'fail': function (res) { 
          wx.showToast({
            title: '用户取消支付',
            image: '../../images/cancel.png',
            duration: 2000
          });
        },
        'complete': function (res) { }
      })
    }, function (msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
    // wx.showToast({
    //   title: '正在提交订单',
    //   icon: 'loading',
    //   duration: 1000
    // });
  },
  onShareAppMessage: function () {

  }
})