var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
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
      status: 0, //是否需要刷新0是 1否
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
    usertoken: ""
  },
  onShow() {
    if (this.data.modelList[this.data.navbarActiveIndex].status == 0) {
      this.init();
    }
    
  },
  onLoad(options) {
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare().then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      this.setData({
        obj: res.Data,

      })
    });
    this.init();
  },
  init: function() {
    let usertoken = wx.getStorageSync('usertoken');
    console.log(usertoken)
    this.setData({
      usertoken: usertoken
    });
    if (usertoken) {
      this.getData();
    }
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
      PayAmount: Number(e.currentTarget.dataset.item.PayAmount/100).toFixed(2),
      OrderSn: e.currentTarget.dataset.item.OrderSn,
      RefundTime: e.currentTarget.dataset.item.RefundTime,
      RefundArrivalTime: e.currentTarget.dataset.item.RefundArrivalTime,
    })
    // wx.showModal({
    //   title: '退款成功',
    //   content: '交易编号:' + e.currentTarget.dataset.item.OrderSn + '\r\n' + 
    //   '退款金额:' + Number(e.currentTarget.dataset.item.PayAmount / 100).toFixed(2) + '\r\n' +
    //   '交易时间:' + e.currentTarget.dataset.item.RefundTime,
    //   showCancel:false,
    //   confirmText:'知道了',
    //   confirmColor:'#3CD5CF'
    // })
  },
  getData: function() {
    let that = this;
    let tempModelList = that.data.modelList;
    tempModelList[that.data.navbarActiveIndex].status = 1; //设置状态为已刷新
    that.setData({
      modelList: tempModelList
    })
    var url = 'order/list';
    var params = {
      Status: that.data.navbarActiveIndex + 1,
      PageCount: 5,
      PageIndex: that.data.modelList[that.data.navbarActiveIndex].pageIndex,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
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
    });
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
    // 获取点击的navbar的index
    let navbarTapIndex = event.currentTarget.dataset.navbarIndex
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    this.setData({
      navbarActiveIndex: navbarTapIndex
    })

    if (this.data.usertoken) {
      if (this.data.modelList[navbarTapIndex].status == 0) {
        this.init();
      }
    }
  },
  //下拉刷新
  onPullDownRefresh: function() {
    let that = this;
    let temp = that.data.modelList;
    temp[that.data.navbarActiveIndex].pageIndex = 1;
    that.setData({
      modelList: temp
    })
    that.init();
    wx.stopPullDownRefresh();
  },
  //上拉加载更多
  onReachBottom: function() {
    let that = this;
    let temp = that.data.modelList;
    temp[that.data.navbarActiveIndex].pageIndex++;
    that.setData({
      modelList: temp
    })
    that.init();
  },
  orderDetail: function(e) {
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?Id=' + e.currentTarget.dataset.id + '&status=' + (this.data.navbarActiveIndex + 1) + '&kd=3',
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
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function(sm) {
        if (sm.confirm) {
          var url = 'order/delete';
          var params = {
            Id: e.currentTarget.dataset.id,
          }
          netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
            that.init();
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