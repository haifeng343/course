var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({

  data: {
    windowHeight: '',
    windowWidth: '',
    Id: '', //教师Id
    Info: {}, //详情
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
      Id: options.id || '',
    })

    that.init();
  },

  init: function() {
    let that = this;
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare("/pages/teacherDetail/teacherDetail", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,
      })
    })
    that.getData();
  },

  getData: function() {
    var that = this;
    var url = 'sheet/teacher/details';
    var params = {
      Id: that.data.Id
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        Info: res.Data
      })
    }, null, false, true, true);
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