var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bg1: '#FF4F4F',
    bg2: '#E88786',
    showSuccess: false,
    List: [],
    Id: '',
    item: {}
  },
  closeded: function() {
    this.setData({
      showSuccess: false
    })
  },
  addBank: function() {
    wx.navigateTo({
      url: '/pages/addBank/addBank',
    })
  },
  onShow:function(){
  },
  onLoad: function(options) {
    this.getData();
    this.setData({
      item: options.item || {}
    })
  },
  navtoWith: function(e) {

    let pages = getCurrentPages(); //当前页面
    let prevPage = pages[pages.length - 2]; //上一页面
    prevPage.setData({ //直接给上移页面赋值
      wihdraw: e.currentTarget.dataset.item,
      CardNumber: e.currentTarget.dataset.item.CardNumber.substring(e.currentTarget.dataset.item.CardNumber.length - 4),
      
    });
    console.log(e.currentTarget.dataset.item.BankCardId)
    wx.navigateBack({
      delta: 1
    });
  },
  getData: function() {
    let that = this;
    var url = 'user/bank/card/list';
    var params = {
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      that.setData({
        List: res.Data
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
  deleted: function(e) {
    let that = this;
    var url = 'user/bank/card/unbind';
    var params = {
      Id: e.currentTarget.dataset.id
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      wx.showToast({
        icon: 'none',
        title: '解绑成功!',
      })
      setTimeout(() => {
        that.getData();
      }, 500)
    }, function(msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  onShareAppMessage: function() {

  }
})