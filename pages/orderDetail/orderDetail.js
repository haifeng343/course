var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();

Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    showCode: true, //条形码弹窗
    showDialog: true, //退款失败 查看原因弹窗
    showSuccess: false, //退款详情 成功弹窗
    Id: '',
    Status: '',
    kd: '',
    ItemList: [],
    detail: {},
    PayAmount: '',
    RefundFailReason: '',
    formId: "",
  },

  onLoad(options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
    });

    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }

    that.setData({
      Id: options.Id || "",
      Status: options.status || "",
      kd: options.kd || "",
      formId: options.formId || "",
    })

    that.init();
  },

  init: function() {
    let that = this;
    shareApi.getShare("/pages/orderDetail/orderDetail", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    }) 
    
    that.getData();
  },
  
  getData: function() {
    var that = this;
    var url = 'order/details'
    var params = {
      Id: that.data.Id,
      Status: that.data.Status,
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        detail: res.Data,
        ItemList: res.Data.ItemList,
        PayAmount: Number(res.Data.PayAmount / 100).toFixed(2),
        RefundFailReason: res.Data.RefundFailReason
      })
    }, null, false, false, false, that.data.formId);
  },

  //条形码弹窗
  codeShow: function() {
    this.setData({
      showCode: false
    })
  },

  dialogShow: function() {
    this.setData({
      showCode: true
    })
  },

  //退款失败 查看原因弹窗
  errorShow: function() {
    let that = this;
    wx.showModal({
      title: '退款失败详情',
      content: that.data.RefundFailReason,
      showCancel: false,
    })
  },

  //取消退款
  cancelOrder: function(e) {
    console.log(e)
    let that = this;
    var url = 'order/refund/cancel';
    var params = {
      Id: e.currentTarget.dataset.id,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      let pages = getCurrentPages(); //当前页面
      let prevPage = pages[pages.length - 2]; //上一页面
      // console.log(prevPage.data.modelList);return;
      if (that.data.kd == 3) {
        let tempList = prevPage.data.modelList;
        tempList.forEach(x => {
          x.list.forEach(item => {
            if (that.data.Id == item.OrderId) {
              if (x.navbarActiveIndex == 3) {
                item.UseStatus = 9;
              } else {
                item.UseStatus = 1;
              }
            }
          })
        })
        prevPage.setData({ //直接给上移页面赋值
          modelList: tempList,
        });
      }
      wx.navigateBack({
        delta: 1
      });
    }); //调用get方法情就是户数
  },

  //重新退款
  Refund: function(e) {
    wx.navigateTo({
      url: '/pages/refund/refund?OrderId=' + e.currentTarget.dataset.orderid + '&kmd=2' + '&kd=' + this.data.kd,
    })
  },

  closed: function() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },

  //退款详情 成功弹窗
  showSucess: function() {
    this.setData({
      showSuccess: true
    })
  },

  onPullDownRefresh: function() {
    this.getData();
    wx.stopPullDownRefresh();
  },

  closeded: function() {
    this.setData({
      showSuccess: !this.data.showSuccess
    });
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