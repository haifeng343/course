var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
      status: 0,//是否需要刷新0是 1否
      pageIndex: 1,
      navbarActiveIndex: 0
    }, {
      list: [],
      status: 0,
      pageIndex: 1,
      navbarActiveIndex: 1
    }, {
      list: [],
      status: 0,
      pageIndex: 1,
      navbarActiveIndex: 2
    }, {
      list: [],
      status: 0,
      pageIndex: 1,
      navbarActiveIndex: 3
    }],
    RefundFailReason: '',
    PayAmount: '',
    OrderSn: '',
    RefundTime: '',
    RefundArrivalTime: '',
  },
  onShow() {
    // this.getData();
  },
  onLoad() {
    this.getData();
  },
  lookEor: function(e) {
    console.log(e)
    this.setData({
      showError: true,
      RefundFailReason: e.currentTarget.dataset.item.RefundFailReason
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
      PayAmount: e.currentTarget.dataset.item.PayAmount,
      OrderSn: e.currentTarget.dataset.item.OrderSn,
      RefundTime: e.currentTarget.dataset.item.RefundTime,
      RefundArrivalTime: e.currentTarget.dataset.item.RefundArrivalTime,
    })
  },
  getData: function() {
    let that = this;
    var url = 'order/list';
    var params = {
      Status: that.data.navbarActiveIndex + 1,
      PageCount: 5,
      PageIndex: that.data.modelList[that.data.navbarActiveIndex].pageIndex,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      let tempModelList = that.data.modelList;
      tempModelList[that.data.navbarActiveIndex].status = 1; //设置状态为已刷新
      let arr = res.Data;
      let arr1 = [];
      if (tempModelList[that.data.navbarActiveIndex].pageIndex == 1) {
        arr1 = arr;
        tempModelList[that.data.navbarActiveIndex].pageIndex = 1; //设置为第一页
      } else {
        arr1 = tempModelList[that.data.navbarActiveIndex].list;
        arr1 = arr1.concat(arr);
        tempModelList[that.data.navbarActiveIndex].pageIndex = tempModelList[that.data.navbarActiveIndex].pageIndex + 1; //页码加1
      }
      tempModelList[that.data.navbarActiveIndex].list = arr1;
      that.setData({
        modelList: tempModelList
      })
      wx.hideLoading();
    }, function(msg) { //onFailed失败回调
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  //取消订单
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
    }, function(msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  /**
   * 点击导航栏
   */
  onNavBarTap: function(event) {
    // 获取点击的navbar的index
    let navbarTapIndex = event.currentTarget.dataset.navbarIndex
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    this.setData({
      navbarActiveIndex: navbarTapIndex
    })
    if (this.data.modelList[navbarTapIndex].status == 0) {
      this.getData();
    }
  },
  //下拉刷新
  onPullDownRefresh: function() {
    let that = this;
    let temp = that.data.modelList;
    temp[that.data.navbarActiveIndex].pageIndex=1;
    that.setData({
      modelList: temp
    })
    that.getData();
    wx.stopPullDownRefresh();
  },
  //上拉加载更多
  onReachBottom: function() {
    // wx.pageScrollTo({
    //   scrollTop: 0,
    //   duration: 0
    // })
    let that = this;
    let temp = that.data.modelList;
    temp[that.data.navbarActiveIndex].pageIndex++;
    that.setData({
      modelList: temp
    })
    that.getData();
  },
  orderDetail: function(e) {
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?Id=' + e.currentTarget.dataset.id + '&status=' + (this.data.navbarActiveIndex + 1)+'&kd=3',
    })
  },
  Refund: function(e) {
    // this.setData({
    //   showDialog: !this.data.showDialog
    // });
    wx.navigateTo({
      url: '/pages/refund/refund?OrderId=' + e.currentTarget.dataset.id+'&kmd=1',
    })
  },
  //删除
  delete: function(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function(sm) {
        if (sm.confirm) {
          let that = this;
          var url = 'order/delete';
          var params = {
            Id: e.currentTarget.dataset.id,
          }
          netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
            this.getData();
          }, function(msg) { //onFailed失败回调
            wx.hideLoading();
            if (msg) {
              wx.showToast({
                title: msg,
              })
            }
          }); //调用get方法情就是户数
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
})