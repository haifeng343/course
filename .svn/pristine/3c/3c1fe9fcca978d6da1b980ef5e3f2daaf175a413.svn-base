var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();

Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    orderId: '',
    detail: {},
    type: "",
  },

  onLoad(options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
    });

    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }

    that.setData({
      orderId: options.OrderId || "",
      type: options.type || "",
    })

    that.init();
    if (that.data.type == 1) {
      that.selectComponent("#pop").getData("payOk_tuandan");
    } else if (that.data.type == 2) {
      that.selectComponent("#pop").getData("payOk_tiyanke");
    }
  },

  init: function() {
    let that = this;
    shareApi.getShare("/pages/payOk/payOk", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    });

    that.getData();
  },

  getData: function() {
    var that = this;
    var url = 'order/pay/issuccess'
    var params = {
      OrderId: that.data.orderId,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调、
      that.setData({
        detail: res.Data,
      })
    }); //调用get方法情就是户数
  },

  navto: function(e) {
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?Id=' + e.currentTarget.dataset.id + '&Status=' + 1,
    })
  },

  groupTo: function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  onShareAppMessage: function(res) {
    return {
      title: this.data.obj.Title,
      path: this.data.obj.SharePath,
      desc: this.data.obj.ShareDes,
      imageUrl: this.data.obj.ShareImgUrl,
      success: (res) => {
        wx.showToast({
          icon: 'none',
          title: '分享成功',
        })
      }
    }
  },
})