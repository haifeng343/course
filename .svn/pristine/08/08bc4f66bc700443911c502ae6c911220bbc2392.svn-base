var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();

Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    Id:'',
    BaseList:[],
    type:'',
  },

  onLoad: function (options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
      Id: options.Id || '',
      type: options.type,
    });

    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }

    that.init();
  },

  init: function () {
    let that = this;
    let type = that.data.type;
    shareApi.getShare("/pages/rewradRule/rewradRule", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
        type: type,
      })
    })

    var url = 'order/rules'
    var params = {
      Id: that.data.Id
    }
    netUtil.postRequest(url, params, function (res) {
      res.Data.forEach(item=>{
        item.PrizeAmount = Number(item.PrizeAmount/100).toFixed(2);
      })
      that.setData({
        BaseList:res.Data
      })
    });
  },
  
  onShareAppMessage: function (res) {
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