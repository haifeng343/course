var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
var loading = true;
var setTime;
Page({
  data: {
    price1: 300,
    price2: 400,
    vip: true,
    showId: 0,
    vipName: '',
    showName: '',
    vipDec: '成为会员，享4大权益',
    cardList: [],
    discountprice: '',
    vipList: [],
    orderId: '', //订单id
    ordersn: '', //订单编号
    payamount: '', //支付金额
    paySuccess: false, //是否支付成功
    userInfo: {},
    showSuccess: false,

    savingAmount:0,
    showDialog:false,
    name:'',
    content:"",
  },

  onShow: function() {
    if (setTime) {
      clearInterval(setTime);
    }
  },

  onLoad: function(options) {
    let that = this;
    that.init();
  },

  init: function() {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare("/pages/subsidyLog/subsidyLog", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,
        userInfo: userInfo || {}
      })
    });

    that._getMyInfo();
    that._getBusinessList();
  },

  closeded: function() {
    this.setData({
      showSuccess: false,
    })
    this._getMyInfo();
  },

// 累计节省
  bindGrand:function(){
    wx.navigateTo({
      url: '/pages/grand/grand',
    })
  },

  // 充值列表
  _getBusinessList: function() {
    let that = this;
    var url = 'member/business/list';
    var params = {
      BusinessType: 1,
    }
    netUtil.postRequest(url, params, function(res) {
      if (res.Data.length>0) {
        that.setData({
          cardList: res.Data,
          showId: res.Data[0].Id || '',
          showName: res.Data[0].Name || ''
        })

        let arr = res.Data;
        arr.forEach(item => {
          console.log(item);
          if (that.data.showId == item.Id) {
            that.setData({
              vipList: item.EquityList,
            })
          }
        })
      }

    })
  },

  // 获取用户信息
  _getMyInfo: function() {
    let that = this;
    let url = 'user/wallet';
    let params = {};
    netUtil.postRequest(url, params, function(res) {
      wx.setStorageSync('userInfo', res.Data);

    }, null, false, false, false)
  },

  // 创建订单
  creat: function() {
    if (this.loading) return;
    this.loading = true;

    wx.showLoading({
      icon: 'none',
      title: '正在创建订单...',
    })

    let that = this;
    var url = 'member/order/create';
    var params = {
      BusinessId: that.data.showId,
    }
    netUtil.postRequest(url, params, function(res) {
      setTimeout(() => {
        that.loading = false;
      }, 200);
      that.setData({
        orderId: res.Data.OrderId,
        ordersn: res.Data.OrderSn,
        payamount: res.Data.PayAmount
      })
      wx.hideLoading();
      that.orderPay();
    }, function(error) {
      wx.hideLoading();
      that.loading = false;
    }, false, true, true)
  },

  // 调起支付
  orderPay: function() {
    var that = this;
    var url = 'member/order/pay'
    var params = {
      OrderId: that.data.orderId,
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        NonceStr: res.Data.NonceStr,
        Package: res.Data.Package,
        PaySign: res.Data.PaySign,
        SignType: res.Data.SignType,
        TimeStamp: res.Data.TimeStamp,
        paySuccess: false,
        showKnow: false,
      });
      wx.requestPayment({
        timeStamp: that.data.TimeStamp,
        nonceStr: that.data.NonceStr,
        package: that.data.Package,
        signType: that.data.SignType,
        paySign: that.data.PaySign,
        'success': function(res) {
          console.log(res)
          that.loading = false;
          that.testPayResult();
        },
        'fail': function(res) {
          that.loading = false;
          that.cancelPay();
        },
      });
    }, function(err) {
      that.loading = false;
    }, true, true, true);
  },

  doPaySuccess: function () {
    let that = this;
    if (setTime) {
      clearInterval(setTime);
    }

    that.setData({
      showSuccess: true
    });

    that._getMyInfo();
  },

  testPayResult: function () {
    let that = this;
    that._isSuccessPay(function (res) {
      if (res.Data && res.Data.IsPay) {
        that.doPaySuccess();
      } else {
        setTime = setInterval(that.testPayResult, 2000);
      }
    });
  },

  //用户取消支付
  cancelPay: function() {
    var that = this;
    var url = 'member/order/cancel'
    var params = {
      Id: that.data.orderId,
    }
    netUtil.postRequest(url, params, function(res) {
      wx.showToast({
        title: '用户取消支付',
        image: '../../images/cancel.png',
      });
    }, null, false, false, false);
  },

  // 判断支付是否成功
  _isSuccessPay: function(onSuccess) {
    var that = this;
    var url = 'member/order/pay/issuccess'
    var params = {
      OrderId: that.data.orderId,
    }
    netUtil.postRequest(url, params, function(res) {
      if (onSuccess) {
        onSuccess(res)
      }
    }, function() {
      if (setTime) {
        clearInterval(setTime);
      }
    });
  },

  clickItem: function(e) {
    let that = this;
    that.setData({
      showId: e.currentTarget.dataset.id,
      showName: e.currentTarget.dataset.name,
      discountprice: e.currentTarget.dataset.discountprice
    });
    let arr = that.data.cardList;
    arr.forEach(item => {
      if (that.data.showId == item.Id) {
        that.setData({
          vipList: item.EquityList,
        })
      }
    })
  },

  showModal: function(e) {
    this.setData({
      name: e.currentTarget.dataset.decname,
      content: e.currentTarget.dataset.dec,
      showDialog:true
    })
  },

  closededs:function(){
    this.setData({
      showDialog:false
    })
  },

  bindFund: function() {
    wx.navigateTo({
      url: '/pages/fund/fund',
    })
  },
  bindRecharge: function() {
    wx.navigateTo({
      url: '/pages/rechargeLog/rechargeLog',
    })
  },

  myBenefit: function() {
    wx.navigateTo({
      url: '/pages/myBenefits/myBenefits',
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