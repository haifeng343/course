var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCode: true, //条形码弹窗
    showDialog: false, //退款失败 查看原因弹窗
    showSuccess: false, //退款详情 成功弹窗
    Id:'',
    Status:'',
    ItemList:[],
  },
  onLoad(options){
    this.setData({
      Id: options.Id,
      Status: options.Status
    })
    this.getData();
  },
  getData: function() {
    var that = this;
    var url = 'order/details'
    var params = {
      Id: that.data.Id,
      Status: that.data.Status,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调、
      console.log(res.Data)
      that.setData({
        detail: res.Data,
        ItemList: res.Data.ItemList,
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
  //条形码弹窗
  codeShow: function() {
    let that = this;
    this.setData({
      showCode: false
    })
  },
  dialogShow: function() {
    let that = this;
    this.setData({
      showCode: true
    })
  },
  //退款失败 查看原因弹窗
  errorShow: function() {
    let that = this;
    that.setData({
      showDialog: true
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
  closeded: function() {
    this.setData({
      showSuccess: !this.data.showSuccess
    });
  },
  onShareAppMessage: function() {

  }
})