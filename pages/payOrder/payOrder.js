var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    checked: true,
    Id: "",
    relId: [],
    ItemList: [],
    TotalAmount: "",
    TotalScore: "",
    UseScore: "",
    UseScoreAmount: "",
    OrderId: '',
    AppId: '',
    NonceStr: '',
    Package: '',
    PaySign: '',
    SignType: '',
    TimeStamp: '',
    TotalAmountFen: '',
  },
  onLoad(options) {
    let that = this;
    let arr = [];
    arr = options.ids.split(',');
    that.setData({
      Id: options.Id,
      relId: arr,
    })
    this.getData();
  },
  getData: function() {
    var that = this;
    var url = 'sheet/buy/details'
    var params = {
      SheetId: that.data.Id,
      RelId: that.data.relId
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调、
      console.log(res)
      that.setData({
        ItemList: res.Data.ItemList,
        UseScore: res.Data.UseScore,
        TotalAmount: Number(res.Data.TotalAmount / 100).toFixed(2),
        TotalScore: res.Data.TotalScore,
        UseScoreAmount: Number(res.Data.UseScoreAmount / 100).toFixed(2),
        TotalAmountFen: (res.Data.TotalAmount - res.Data.UseScoreAmount) / 100
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
  swich: function() {
    var checked = this.data.checked;
    this.setData({
      "checked": !checked
    })
  },
  //支付成功
  payok: function(onSuccess) {
    var that = this;
    var url = 'order/pay/issuccess'
    var params = {
      OrderId: that.data.OrderId,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调、
      that.setData({
        orderContent: res.Data
      })
      onSuccess(res.Data);
    }, function(msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  oderPay: function() {
    var that = this;
    var url = 'order/pay'
    var params = {
      OrderId: that.data.OrderId,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调、
      that.setData({
        NonceStr: res.Data.NonceStr,
        Package: res.Data.Package,
        PaySign: res.Data.PaySign,
        SignType: res.Data.SignType,
        TimeStamp: res.Data.TimeStamp,
      });
      console.log(res)
      wx.requestPayment({
        timeStamp: that.data.TimeStamp,
        nonceStr: that.data.NonceStr,
        package: that.data.Package,
        signType: that.data.SignType,
        paySign: that.data.PaySign,
        'success': function(res) {
          var setTime = setTimeout(function() {
            that.payok(function(res) {
              if (res.IsPay) {
                clearTimeout(setTime);
                wx.showToast({
                  title: '订单创建成功',
                  icon: 'none',
                  duration: 1000
                });
                wx.navigateTo({
                  url: '/pages/payOk/payOk?OrderId=' + that.data.OrderId,
                })
              }
            });
          }, 2000);
        },
        'fail': function(res) {
          wx.showToast({
            title: '用户取消支付',
            image: '../../images/cancel.png',
          });
        },
      });
    }, function(msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  paySure: function() {
    var that = this;
    var url = 'order/create'
    var params = {
      SheetId: that.data.Id,
      RelId: that.data.relId,
      UseScore: that.data.checked,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调、
      console.log(res)
      that.setData({
        OrderId: res.Data.OrderId
      })
      that.oderPay();
    }, function(msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数

  },
  onShareAppMessage: function() {

  }
})