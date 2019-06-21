
Page({

  data: {
    checked:false,
  },
  swich:function() {
    var checked = this.data.checked;
    this.setData({
      "checked": !checked
    })
  },
  paySure:function() {
    wx.showToast({
      title: '正在提交订单',
      icon: 'loading',
      duration: 1000
    });
    wx.showToast({
      title: '用户取消支付',
      image: '../../images/cancel.png',
      duration: 2000
    });
  },
  onShareAppMessage: function () {
    
  }
})