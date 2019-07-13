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
    showError:false,
    showSuccess:false,
    List:[],
    RefundFailReason:'',
    PayAmount:'',
    OrderSn:'',
    RefundTime:'',
    RefundArrivalTime:'',
    page:1,
    pagecont:20,
  },
  onShow(){
    // this.getData();
  },
  onLoad() {
    this.getData();
  },
  lookEor:function(e){
    console.log(e)
    this.setData({
      showError:true,
      RefundFailReason: e.currentTarget.dataset.item.RefundFailReason
    })
  },
  lookDetails:function(e){
    this.setData({
      showSuccess: true,
      PayAmount: e.currentTarget.dataset.item.PayAmount,
      OrderSn: e.currentTarget.dataset.item.OrderSn,
      RefundTime: e.currentTarget.dataset.item.RefundTime,
      RefundArrivalTime: e.currentTarget.dataset.item.RefundArrivalTime,
    })
  },
  getData: function () {
    let that = this;
    var url = 'order/list';
    var params = {
      Status: that.data.navbarActiveIndex + 1,
      PageCount: that.data.pagecont,
      PageIndex: that.data.page,
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      let arr = res.Data;
      if(arr.length>0){
        let arr1 = [];
        if(that.data.page==1){
          arr1 = arr;
        }else{
          arr1 = that.data.List;
          arr1 = arr1.concat(arr);
        }
        that.setData({
          List: arr1
        })
      }
    }, function (msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  //取消订单
  cancelOrder:function(e) {
    let that = this;
    var url = 'order/refund/cancel';
    var params = {
      Id: e.currentTarget.dataset.id,
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      wx.showToast({
        icon:"none",
        title: '取消退款成功',
      })
      that.getData();
    }, function (msg) { //onFailed失败回调
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
  onNavBarTap: function (event) {
    // 获取点击的navbar的index
    let navbarTapIndex = event.currentTarget.dataset.navbarIndex
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    this.setData({
      navbarActiveIndex: navbarTapIndex
    })
    this.getData();
  },

  /**
   * 
   */
  onBindAnimationFinish: function ({ detail }) {
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    this.setData({
      navbarActiveIndex: detail.current
    })
  },
  //下拉刷新
  onPullDownRefresh:function(){
    let that = this;
    that.setData({
      page:1
    })
    that.getData();
    wx.stopPullDownRefresh();
  },
  //上拉加载更多
  onReachBottom:function(res){
    let that = this;
    let temp = that.data.page;
    temp++;
    that.setData({
      page: temp
    })
    that.getData();
  },
  orderDetail:function(e) {
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?Id=' + e.currentTarget.dataset.id + '&status=' + (this.data.navbarActiveIndex + 1),
    })
  },
  Refund:function(e) {
    // this.setData({
    //   showDialog: !this.data.showDialog
    // });
    wx.navigateTo({
      url: '/pages/refund/refund?OrderId='+e.currentTarget.dataset.id,
    })
  },
  //删除
  delete:function(e){
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          let that = this;
          var url = 'order/delete';
          var params = {
            Id: e.currentTarget.dataset.id,
          }
          netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
            this.getData();
          }, function (msg) { //onFailed失败回调
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
  closeds:function(){
    this.setData({
      showError: !this.data.showError
    });
  },
  closeded: function () {
    this.setData({
      showSuccess: !this.data.showSuccess
    });
  },
})