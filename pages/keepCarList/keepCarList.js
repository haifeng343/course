var netUtil = require("../../utils/request.js"); //require引入
Page({

  
  data: {
    List:[],
  },
  onLoad(options){
    this.getData();
  },
  //点击搜索
  getData: function () {
    let that = this;
    var url = 'user/bank/support/list';
    var params = {
      
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      that.setData({
        List : res.Data
      })
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})