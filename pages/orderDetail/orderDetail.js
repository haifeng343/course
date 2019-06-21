// pages/orderDetail/orderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCode:true,  //条形码弹窗
    showDialog: false,//退款失败 查看原因弹窗
    showSuccess:false,//退款详情 成功弹窗
  },
  //条形码弹窗
  codeShow:function() {
    let that = this;
    this.setData({
      showCode : false
    })
  },
  dialogShow:function() {
    let that = this;
    this.setData({
      showCode: true
    })
  },
  //退款失败 查看原因弹窗
  errorShow:function() {
    let that = this;
    that.setData({
      showDialog:true
    })
  },

  closed: function () {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  //退款详情 成功弹窗
  showSucess:function() {
    this.setData({
      showSuccess: true
    })
  },
  closeded: function () {
    this.setData({
      showSuccess: !this.data.showSuccess
    });
  },
  onShareAppMessage: function () {

  }
})