// pages/addBank/addBank.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSuccess:false,
    bankName:"中国",
    btntext:"(59s)后重新获取",
    notEdit:false,
  },

  Description:function(){
    this.setData({
      showSuccess : true
    })
  },
  closeded:function() {
    this.setData({
      showSuccess: false
    })
  },
  onShareAppMessage: function () {

  }
})