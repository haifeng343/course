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
  orderDetail:function() {
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail',
    })
  },
  Refund:function() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  closed:function(){
    this.setData({
      showDialog: !this.data.showDialog
    });
  }
})