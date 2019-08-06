var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
Page({

  data: {
    checked: false,
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
    OrderSn: '', //订单编号
    PayAmount: '', //支付金额
    paySuccess: false
  },
  onShow: function () {
    let that = this;
    if (that.data.paySuccess == true) {
      wx.reLaunch({
        url: '/pages/wait/wait?OrderId=' + that.data.OrderId + '&ordersn=' + that.data.OrderSn + '&money=' + that.data.TotalAmount,
      })
    }
  },
  onLoad(options) {
    let that = this;
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare().then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,

      })
    })
    let arr = [];
    arr = options.ids.split(',');
    that.setData({
      Id: options.Id,
      relId: arr,
    })
    this.init();
  },
  init: function() {
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
        TotalAmountFen: Number((res.Data.TotalAmount - res.Data.UseScoreAmount) / 100).toFixed(2)
      })
    }); //调用get方法情就是户数
  },
  swich: function() {
    var checked = this.data.checked;
    this.setData({
      "checked": !checked
    })
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
        paySuccess: false
      });
      wx.requestPayment({
        timeStamp: that.data.TimeStamp,
        nonceStr: that.data.NonceStr,
        package: that.data.Package,
        signType: that.data.SignType,
        paySign: that.data.PaySign,
        'success': function(res) {
          that.setData({
            paySuccess: true
          });
          wx.reLaunch({
            url: '/pages/wait/wait?OrderId=' + that.data.OrderId + '&ordersn=' + that.data.OrderSn + '&money=' + that.data.TotalAmount,
          })
          // var setTime = setTimeout(function() {
          //   wx.reLaunch({
          //     url: '/pages/wait/wait?OrderId=' + that.data.OrderId + '&ordersn=' + that.data.OrderSn + '&money=' + that.data.TotalAmount,
          //   })
          // }, 800);
        },
        'fail': function(res) {
          that.cancelPay();
          wx.showToast({
            title: '用户取消支付',
            image: '../../images/cancel.png',
          });
        },
      });
    }); //调用get方法情就是户数
  },
  //用户取消支付
  cancelPay: function() {
    var that = this;
    var url = 'order/cancel'
    var params = {
      Id: that.data.OrderId,
    }
    netUtil.postRequest(url, params, function(res){}, '',false,false,false);
  },
  paySure: function() {
    wx.showLoading({
      icon: 'none',
      title: '正在创建订单...',
    })
    var that = this;
    var url = 'order/create'
    var params = {
      SheetId: that.data.Id,
      RelId: that.data.relId,
      UseScore: that.data.checked,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调、
      that.setData({
        OrderId: res.Data.OrderId,
        OrderSn: res.Data.OrderSn,
        PayAmount: res.Data.PayAmount
      })
      that.oderPay();
    },'',false);

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