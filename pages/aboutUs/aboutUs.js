var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    html: '<div class="div_class" style="padding:0 5%;">Hello&nbsp;World!</div>'
  },
  onLoad: function() {
    // let that = this;
    // var url = 'user/bank/card/check';
    // var params = {
    //   CardNumber: that.data.CardNumber
    // }
    // netUtil.postRequest(url, params, function(res) { //onSuccess成功回调

    //   that.setData({
    //     next: false,
    //     bankName: res.Data.BankName + res.Data.CardBreed,
    //     Icar: res.Data,
    //   })
    // }, function(msg) { //onFailed失败回调
    //   wx.hideLoading();
    //   if (msg) {
    //     wx.showToast({
    //       title: msg,
    //     })
    //   }
    // });
  },
  onShareAppMessage: function() {

  }
})