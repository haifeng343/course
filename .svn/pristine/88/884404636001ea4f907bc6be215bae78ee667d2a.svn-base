
var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
Page({


  data: {
    showSuccess:false,
    codeNumber:'',

  },

  onLoad: function (options) {
    let that = this;
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    that.setData({
      codeNumber: options.codeNumber || ''
    })
    if (options.codeNumber){
      that._welfareExchange(options.codeNumber);
    }
  },
  hasCodeNumber:function(e){
    this.setData({
      codeNumber:e.detail.value
    })
  },
  init: function () {
    let that = this;
    shareApi.getShare("/pages/exchange/exchange", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    });
    that._welfareExchange(that.data.codeNumber);
  },
  _welfareExchange: function (codeNumber) {
    let that = this;
    if (!codeNumber){
      wx.showToast({
        icon:"none",
        title: '请输入兑换码',
      })
      return
    }
    var url = 'user/welfare/exchange';
    var params = {
      CodeNumber: codeNumber,
    }
    netUtil.postRequest(url, params, function (res) {
      that.setData({
        showSuccess:true,
        codeNumber:""
      })
    });
  },
  binSend:function() {
    this._welfareExchange(this.data.codeNumber);
  },
  closeded:function() {
    this.setData({
      showSuccess:false
    })
  },
  exchange:function() {
    wx.navigateTo({
      url: '/pages/exchange/exchange',
    })
  },
  
  onShareAppMessage: function () {

  }
})