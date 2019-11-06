var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();

Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    checked: false,
    Id: "",
    relId: [],
    ItemList: [], //订单列表
    totalAmount: "", //总金额
    UseScore: "",
    totalCount: "", //总门数
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
    paySuccess: false, //是否支付成功
    Info: {}, //数据详情
    useScoreAmount: 0, //使用积分抵扣金额
    parmasItem: [], //请求列表参数
    type: '', //1团单 2 商圈
    PrizeAmount: "", //总的奖励金额
    showKnow: false, //购买须知弹窗
    type: '',
    PrizeAmount: "", //现金奖励
    isShowPayWnd: false,
  },

  onShow: function() {
    let that = this;
    that.setData({
      isShowPayWnd: true
    });
    if (that.data.paySuccess == true) {
      wx.reLaunch({
        url: '/pages/wait/wait?OrderId=' + that.data.OrderId + '&ordersn=' + that.data.OrderSn + '&money=' + that.data.totalAmount + '&type=' + that.data.type,
      })
    }
  },

  closeShowKnow: function() {
    this.setData({
      showKnow: false
    });

    this.cancelPay();
  },

  navtoRule: function() {
    wx.navigateTo({
      url: '/pages/rewradRule/rewradRule?Id=' + this.data.OrderId+'&type='+this.data.type,
    })
  },

  getShow: function(e) {
    if (this.loading) return;
    this.loading = true;
    let formId = "";
    if (e.detail.formId != "the formId is a mock one") {
      formId = e.detail.formId;
    }

    this.oderPay(formId);
  },

  onLoad(options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
      parmasItem: JSON.parse(options.checkItem) || [],
      type: options.type || ''
    });

    if (options.type == 1) {
      wx.setNavigationBarTitle({
        title: '支付订单',
      })
    } else if (options.type == 2) {
      wx.setNavigationBarTitle({
        title: '预约订单',
      })
    }

    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }

    let arr = [];
    // arr = options.ids.split(',');
    that.setData({
      Id: options.Id || '',
      relId: arr,
    })

    that.init();
  },

  init: function() {
    let that = this;
    shareApi.getShare("/pages/payOrder/payOrder", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      });
    });

    that.getData();
  },

  getData: function() {
    var that = this;
    var url = 'sheet/buy/details'
    var params = {
      List: that.data.parmasItem
    }
    netUtil.postRequest(url, params, function(res) {
      res.Data.ItemList.forEach(item => {
        item.Price = Number(item.Price / 100).toFixed(2);
        item.PrizeAmount = Number(item.PrizeAmount / 100).toFixed(2);
      })

      that.setData({
        ItemList: res.Data.ItemList,
        totalAmount: Number(res.Data.TotalAmount / 100).toFixed(2),
        useScoreAmount: Number(res.Data.UseScoreAmount / 100).toFixed(2),
        PrizeAmount: Number(res.Data.PrizeAmount / 100).toFixed(2),
        totalCount: res.Data.ItemCount,
        Info: res.Data,
      })
    });
  },

  swich: function() {
    var checked = this.data.checked;
    this.setData({
      checked: !checked,
      totalAmount: checked ? this.data.totalAmount : (this.data.totalAmount - this.data.useScoreAmount).toFixed(2)
    })
  },

  oderPay: function(formId) {
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
        paySuccess: false,
        showKnow: false,
        isShowPayWnd: false
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
          that.loading = false;
          if (that.data.isShowPayWnd) {
            wx.reLaunch({
              url: '/pages/wait/wait?OrderId=' + that.data.OrderId + '&ordersn=' + that.data.OrderSn + '&money=' + that.data.totalAmount + '&type=' + that.data.type,
            })
          }
        },
        'fail': function(res) {
          that.loading = false;
          that.cancelPay();
        },
      });
    }, function(err) {
      that.loading = false;
    }, true, true, true, formId); //调用get方法情就是户数
  },

  //用户取消支付
  cancelPay: function() {
    var that = this;
    var url = 'order/cancel'
    var params = {
      Id: that.data.OrderId,
    }
    netUtil.postRequest(url, params, function(res) {
      wx.showToast({
        title: '用户取消支付',
        image: '../../images/cancel.png',
      });
    }, '', false, false, false);
  },

  paySure: function(e) {
    if (this.loading) return;
    this.loading = true;
    let formId = "";
    if (e.detail.formId != "the formId is a mock one") {
      formId = e.detail.formId;
    }

    wx.showLoading({
      icon: 'none',
      title: '正在创建订单...',
    })

    var that = this;
    var url = 'order/create'
    var params = {
      List: that.data.parmasItem,
      UseScore: that.data.checked,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调、
      setTimeout(() => {
        that.loading = false;
      }, 200);
      let pages = getCurrentPages(); //当前页面
      let prevPage = pages[pages.length - 2]; //上一页面
      prevPage.setData({ //直接给上移页面赋值
        load: true || ''
      });

      that.setData({
        OrderId: res.Data.OrderId,
        OrderSn: res.Data.OrderSn,
        PayAmount: (res.Data.PayAmount / 100).toFixed(2),
      });

      if (that.data.type == 2) {
        that.setData({
          showKnow: true
        });
      } else {
        that.oderPay();
      }

      wx.hideLoading();
    }, function(error) {
      wx.hideLoading();
      that.loading = false;
    }, false, true, true, formId);
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