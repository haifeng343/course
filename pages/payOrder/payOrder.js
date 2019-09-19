var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    windowHeight: app.globalData.windowHeight,
    checked: false,
    Id: "",
    relId: [],
    ItemList: [],//订单列表
    totalAmount: "",//总金额
    UseScore: "",
    totalCount: "",//总门数
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
    paySuccess: false,
    Info:{},//数据详情
    useScoreAmount:0,//使用积分抵扣金额
    parmasItem:[],//请求列表参数
    type:'',//1团单 2 商圈
    PrizeAmount:"",//总的奖励金额
    showKnow:false,//购买须知弹窗
    type:'',
    PrizeAmount:"",//现金奖励
  },
  onShow: function () {
    let that = this;
    if (that.data.paySuccess == true) {
      wx.reLaunch({
        url: '/pages/wait/wait?OrderId=' + that.data.OrderId + '&ordersn=' + that.data.OrderSn + '&money=' + that.data.totalAmount,
      })
    }
  },
  closeShowKnow:function() {
    this.setData({
      showKnow:false
    })
    this.cancelPay();
  },
  navtoRule:function() {
    wx.navigateTo({
      url: '/pages/rewradRule/rewradRule?Id=' + this. data.OrderId,
    })
  },
  getShow:function() {
    this.oderPay();
  },
  onLoad(options) {
    console.log(JSON.parse(options.checkItem))
    let that = this;
    that.setData({
      parmasItem: JSON.parse(options.checkItem) || [],
      type: options.type || ''
    })
    if(options.type==1){
      wx.setNavigationBarTitle({
        title: '支付订单',
      })
    }
    if(options.type==2){
      wx.setNavigationBarTitle({
        title: '预约订单',
      })
    }
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare("/pages/payOrder/payOrder",0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,
        type: options.type || ''
      })
    })
    let arr = [];
    // arr = options.ids.split(',');
    that.setData({
      Id: options.Id || '',
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
      List: that.data.parmasItem
    }
    netUtil.postRequest(url, params, function(res) {
      res.Data.ItemList.forEach(item=>{
        item.Price = Number(item.Price/100).toFixed(2);
        item.PrizeAmount = Number(item.PrizeAmount/100).toFixed(2);
      })
      that.setData({
        ItemList: res.Data.ItemList,
        totalAmount: Number(res.Data.TotalAmount/100).toFixed(2),
        useScoreAmount: Number(res.Data.UseScoreAmount/100).toFixed(2),
        PrizeAmount: Number(res.Data.PrizeAmount/100).toFixed(2),
        totalCount: res.Data.ItemCount,
        Info:res.Data,
      })
      console.log(that.data.PrizeAmount)
    });
  },
  swich: function() {
    var checked = this.data.checked;
    this.setData({
      checked: !checked,
      totalAmount: checked ? this.data.totalAmount:(this.data.totalAmount - this.data.useScoreAmount).toFixed(2)
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
          that.setData({
            paySuccess: true
          });
          wx.reLaunch({
            url: '/pages/wait/wait?OrderId=' + that.data.OrderId + '&ordersn=' + that.data.OrderSn + '&money=' + that.data.totalAmount,
          })
          // var setTime = setTimeout(function() {
          //   wx.reLaunch({
          //     url: '/pages/wait/wait?OrderId=' + that.data.OrderId + '&ordersn=' + that.data.OrderSn + '&money=' + that.data.TotalAmount,
          //   })
          // }, 800);
        },
        'fail': function(res) {
          that.cancelPay();
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
    netUtil.postRequest(url, params, function(res){
      wx.showToast({
        title: '用户取消支付',
        image: '../../images/cancel.png',
      });
    }, '',false,false,false);
  },
  paySure: function() {
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
      let pages = getCurrentPages(); //当前页面
      let prevPage = pages[pages.length - 2]; //上一页面
      prevPage.setData({ //直接给上移页面赋值
        load : true || ''
      });
      that.setData({
        OrderId: res.Data.OrderId,
        OrderSn: res.Data.OrderSn,
        PayAmount: (res.Data.PayAmount/100).toFixed(2),
      })
      if(that.data.type==2){
        that.setData({
          showKnow:true
        })
      }else{
        that.oderPay();
      }
      wx.hideLoading();
    },'',false,true,true);

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