var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
var loading = true;
var setTime;
Page({

  data: {
    windowHeight: '',
    windowWidth: '',
    btnTxt: "好友助力",
    content: {},
    concat: null,
    type: '',

    price: 0,
    id:'',

    orderId: '', //订单id
    payamount: '', //支付金额
    paySuccess: false, //是否支付成功
    showSuccess: false, 
    userInfo:{},
  },

  onLoad: function(options) {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');

    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
      type: options.type || '',
      userInfo: userInfo
    });

    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }

    that.init();
  },

  init: function() {
    let that = this;
    that.getData();

    let recommand = wx.getStorageSync('userInfo').RecommandCode; //我的分享码
    shareApi.getShare("/pages/boostTo/boostTo", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj1: res.Data,
      })
    });
  },

  closeded: function() {
    this.setData({
      showSuccess: false
    })
  },

  getData: function() {
    let that = this;
    var url = 'page/info';
    var params = {
      Type: that.data.type == 1 ? 6 : 5,
    }
    netUtil.postRequest(url, params, function(res) {
      if (res.Data) {
        that.setData({
          content: JSON.parse(res.Data.Content)
        })
        wx.setNavigationBarTitle({
          title: that.data.content.pageTitle,
        })

        wx.getSystemInfo({
          success: function(res) {
            console.log(res)
            let temp = that.data.content;

            if (res.model == "iPhone X") {
              temp.ShowUrl = that.data.content.ShowUrlIphoneX;
              that.setData({
                totalTopHeight: 68,
                content: temp
              })
            }

            if (res.model == "iPhone 6") {
              temp.ShowUrl = that.data.content.ShowUrlIphone6
              that.setData({
                totalTopHeight: 20,
                content: temp
              })
            }

          },
        })
        console.log(that.data.content)
      }

      if(that.data.type==1){
        that._serviceRes(that.data.content.serviceName);
      }
      that._memberFundRecharge(that.data.content.token)
    })

  },

  clickTo: function() {
    let that = this;
    let actiontype = that.data.content.button1JumpType;
    let actionparams = that.data.content.button1JumpPath;
    if (actionparams.substr(0, 1) === '/') {

    } else {
      actionparams = '/' + actionparams;
    }

    if (actiontype == 1) {
      if (actionparams == "/pages/index/index" || actionparams == "/pages/order/order" || actionparams == "/pages/mine/mine") {
        wx.switchTab({
          url: actionparams,
        })
      } else {
        wx.navigateTo({
          url: actionparams,
        })
      }
    } else if (actiontype == 2) {
      wx.navigateTo({
        url: '/pages/WebView/WebView?path=' + actionparams,
      })
    } else if (actiontype == 3) {
      wx.navigateTo({
        url: '/page/concat/concat',
      })
    }
  },
  _serviceRes: function(name) {
    let that = this;
    var url = 'user/service/res';
    var params = {
      Name: name,
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        concat: res.Data
      })
    })
  },

  // 获取合伙人充值信息
  _memberFundRecharge: function (token) {
    let that = this;
    var url = 'member/fund/recharge';
    var params = {
      Token: token,
    }
    netUtil.postRequest(url, params, function (res) {
      if(res.Data){
        that.setData({
          price: res.Data.Price,
          id:res.Data.Id
        })
      }
    })
  },

  // 创建订单
  creat: function () {
    if (this.loading) return;
    
    this.loading = true;
    wx.showLoading({
      icon: 'none',
      title: '正在创建订单...',
    })

    let that = this;
    var url = 'member/fund/order/create';
    var params = {
      Id:that.data.id,
      Token: that.data.content.token,
    }
    netUtil.postRequest(url, params, function (res) {
      setTimeout(() => {
        that.loading = false;
      }, 200);
      that.setData({
        orderId: res.Data.OrderId,
        payamount: res.Data.PayAmount
      })
      wx.hideLoading();
      that.orderPay();
    }, function (error) {
      wx.hideLoading();
      that.loading = false;
    }, false, true, true)
  },

  // 调起支付
  orderPay: function () {
    var that = this;
    var url = 'member/fund/order/pay'
    var params = {
      OrderId: that.data.orderId,
    }
    netUtil.postRequest(url, params, function (res) {
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
        'success': function (res) {
          console.log(res)
          that.loading = false;
          that.testPayResult();
        },
        'fail': function (res) {
          that.loading = false;
          that.cancelPay();
        },
      });
    }, function (err) {
      that.loading = false;
    }, true, true, true);
  },

  doPaySuccess:function(){
    let that = this;
    if (setTime) {
      clearInterval(setTime);
    }

    that.setData({
      showSuccess: true
    });

    that._getMyInfo();
  },

  testPayResult:function(){
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
  cancelPay: function () {
    var that = this;
    var url = 'member/fund/order/cancel'
    var params = {
      Id: that.data.orderId,
    }
    netUtil.postRequest(url, params, function (res) {
      wx.showToast({
        title: '用户取消支付',
        image: '../../images/cancel.png',
      });
    }, null, false, false, false);
  },

  // 判断支付是否成功
  _isSuccessPay: function (onSuccess) {
    var that = this;
    var url = 'member/fund/order/pay/issuccess'
    var params = {
      OrderId: that.data.orderId,
    }
    netUtil.postRequest(url, params, function (res) {
      if (onSuccess) {
        onSuccess(res)
      }
    }, function () {
      if (setTime) {
        clearInterval(setTime);
      }
    });
  },

  // 获取用户信息
  _getMyInfo: function () {
    let that = this;
    let url = 'user/wallet';
    let params = {};
    netUtil.postRequest(url, params, function (res) {
      that.setData({
        userInfo: res.Data
      });
      wx.setStorageSync('userInfo', res.Data);
    }, null, false, false, false)
  },

  onShareAppMessage: function(res) {
    return {
      title: this.data.obj1.Title,
      path: this.data.obj1.SharePath,
      desc: this.data.obj1.ShareDes,
      imageUrl: this.data.obj1.ShareImgUrl,
      success: (res) => {
        wx.showToast({
          icon: 'none',
          title: '分享成功',
        })
      }
    }
  },
})