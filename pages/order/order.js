var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    navbarActiveIndex: 0,
    navbarTitle: [
      "全部订单",
      "可使用",
      "已完成/已过期",
      "退款"
    ],
    showDialog: false,
    showError: false,
    showSuccess: false,
    modelList: [{
      list: [],
      status: 0, //是否需要刷新0是 1否
      pageIndex: 0,
      wantIndex: 0,
      navbarActiveIndex: 0
    }, {
      list: [],
      status: 0,
      pageIndex: 0,
      wantIndex: 0,
      navbarActiveIndex: 1
    }, {
      list: [],
      status: 0,
      pageIndex: 0,
      wantIndex: 0,
      navbarActiveIndex: 2
    }, {
      list: [],
      status: 0,
      pageIndex: 0,
      wantIndex: 0,
      navbarActiveIndex: 3
    }],
    RefundFailReason: '',
    PayAmount: '',
    OrderSn: '',
    RefundTime: '',
    RefundArrivalTime: '',
    usertoken: ""
  },

  onShow: function() {
    this.setData({
      usertoken: wx.getStorageSync('usertoken')
    });

    this.getData(false, false);
  },

  getData: function (isForceData, isRefreshData){
    if ((isForceData || this.data.modelList[this.data.navbarActiveIndex].status == 0) && this.data.usertoken) {
      this._getData(isRefreshData ? 1 : this.data.modelList[this.data.navbarActiveIndex].pageIndex + 1);
    }
  },

  _getData: function (wantIndex) {
    let that = this;
    if (that.data.modelList[that.data.navbarActiveIndex].wantIndex > 0) {
      return;
    }

    let tempModelList = that.data.modelList;
    tempModelList[that.data.navbarActiveIndex].wantIndex = wantIndex;
    that.setData({
      modelList: tempModelList
    })

    var url = 'order/list';
    var params = {
      Status: that.data.navbarActiveIndex + 1,
      PageCount: 20,
      PageIndex: wantIndex,
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      let arr = [];
      if (tempModelList[that.data.navbarActiveIndex].wantIndex == 1) {
        arr = res.Data;
      } else {
        arr = tempModelList[that.data.navbarActiveIndex].list;
        arr = arr.concat(res.Data);
      }
      
      if (res.Data.length > 0) {
        tempModelList[that.data.navbarActiveIndex].pageIndex = tempModelList[that.data.navbarActiveIndex].wantIndex;
      }
      tempModelList[that.data.navbarActiveIndex].status = 1; //设置状态为已刷新
      tempModelList[that.data.navbarActiveIndex].wantIndex = 0;
      tempModelList[that.data.navbarActiveIndex].list = arr;
      that.setData({
        modelList: tempModelList
      })
    }, function(error) {
      tempModelList[that.data.navbarActiveIndex].wantIndex = 0;
      that.setData({
        modelList: tempModelList
      })
    });
  },

  onLoad: function(options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
    });

    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }

    that.init();
    that.selectComponent('#pop').getData('order');
  },

  init: function() {
    let that = this;
    shareApi.getShare("/pages/order/order", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    });
  },

  bindLogin: function() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  lookEor: function(e) {
    let that = this;
    wx.showModal({
      title: '退款失败详情',
      content: e.currentTarget.dataset.item.RefundFailReason,
      showCancel: false,
    })
  },

  toggleDialog: function() {
    this.setData({
      showError: false
    })
  },

  lookDetails: function(e) {
    this.setData({
      showSuccess: true,
      PayAmount: Number(e.currentTarget.dataset.item.PayAmount / 100).toFixed(2),
      OrderSn: e.currentTarget.dataset.item.OrderSn,
      RefundTime: e.currentTarget.dataset.item.RefundTime,
      RefundArrivalTime: e.currentTarget.dataset.item.RefundArrivalTime,
    })
  },

  //取消退款
  cancelOrder: function(e) {
    let that = this;
    var url = 'order/refund/cancel';
    var params = {
      Id: e.currentTarget.dataset.id,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      wx.showToast({
        icon: "none",
        title: '取消退款成功',
      })
      let tempList = that.data.modelList;
      tempList.forEach(x => {
        x.list.forEach(item => {
          if (e.currentTarget.dataset.id == item.OrderId) {
            if (x.navbarActiveIndex == 3) {
              item.UseStatus = 9;
            } else {
              item.UseStatus = 1;
            }
          }
        })
      })

      that.setData({
        modelList: tempList
      })
    }); //调用get方法情就是户数
  },

  /**
   * 点击导航栏
   */
  onNavBarTap: function(event) {
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    this.setData({
        navbarActiveIndex: event.currentTarget.dataset.navbarIndex
    })

    this.getData(false, false);
  },

  //下拉刷新
  onPullDownRefresh: function() {
    this.getData(true, true);
    wx.stopPullDownRefresh();
  },

  //上拉加载更多
  onReachBottom: function() {
    this.getData(true, false);
  },

  orderDetail: function(e) {
    let formId = "";
    if (e.detail.formId != "the formId is a mock one") {
      formId = e.detail.formId;
    }
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?Id=' + e.currentTarget.dataset.id + '&status=' + (this.data.navbarActiveIndex + 1) + '&kd=3' + '&formId=' + formId,
    })
  },
  Refund: function(e) {
    // this.setData({
    //   showDialog: !this.data.showDialog
    // });
    wx.navigateTo({
      url: '/pages/refund/refund?OrderId=' + e.currentTarget.dataset.id + '&kmd=1',
    })
  },

  //删除
  delete: function(e) {
    let that = this;
    console.log(e)
    let orderid = e.currentTarget.dataset.orderid;
    let orderindex = e.currentTarget.dataset.orderindex;
    wx.showModal({
      title: '',
      content: '确定删除此订单吗？',
      success: function(sm) {
        if (sm.confirm) {
          var url = 'order/delete';
          var params = {
            Id: e.currentTarget.dataset.orderid,
          }
          netUtil.postRequest(url, params, function(res) {
            wx.showToast({
              icon: 'none',
              title: '成功删除',
            })

            let tempList = that.data.modelList;
            tempList[that.data.navbarActiveIndex].list.splice(orderindex, 1);
            that.setData({
              modelList: tempList
            });
          });
        } else if (sm.cancel) {

        }
      }
    })
  },

  closeds: function() {
    this.setData({
      showError: !this.data.showError
    });
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