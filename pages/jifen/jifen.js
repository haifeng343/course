var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    html: '',
    title:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    console.log(options)
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
      title :options.title || '积分规则',
    });

    const eventChannel = that.getOpenerEventChannel();
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('getNextPageData', function (data) {
      if (options.title) {
        that.setData({
          html: data.data.rulesContent || ''
        })
      } else {
        that.init();
      }
    })


    wx.setNavigationBarTitle({
      title: that.data.title,
    })
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    
  },

  init: function() {
    let that = this;
    shareApi.getShare("/pages/jifen/jifen", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    });

    var url = 'banner/page/content';
    var params = {
      Code: 'ScoreRules'
    }

    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      if (res.Data) {
        that.setData({
          html: res.Data.Content
        })
      }
    });
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