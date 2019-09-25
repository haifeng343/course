// pages/kaquan/kaquan.js
Page({

  data: {
    des: 1, //隐藏
  },

  onLoad: function(options) {

  },
  showDes: function() {
    this.setData({
      des: this.data.des == 1 ? 2 : 1
    })
  },
  onShareAppMessage: function() {

  }
})