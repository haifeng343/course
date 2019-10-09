var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    bg1: '#FF4F4F',
    bg2: '#E88786',
    showSuccess: false,
    List: [],
    Id: '',
    item: {},
    ibd:'false',
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

  onLoad: function(options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
    });

    that.setData({
      ibd:options.ibd || 'false',
    })
    
    wx.setNavigationBarTitle({
      title: that.data.ibd == 'true' ? '选择银行卡':'银行卡'
    })

    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }

    that.init();
    that.setData({
      item: options.item || {}
    })
  },

  init: function() {
    let that = this;
    shareApi.getShare("/pages/backList/backList", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    })

    that.getData();
  },

  navtoWith: function(e) {
    if(this.data.ibd=='true'){
      let pages = getCurrentPages(); //当前页面
      let prevPage = pages[pages.length - 2]; //上一页面
      prevPage.setData({ //直接给上移页面赋值
        wihdraw: e.currentTarget.dataset.item,
        CardNumber: e.currentTarget.dataset.item.CardNumber.substring(e.currentTarget.dataset.item.CardNumber.length - 4) || '',
      });
      wx.navigateBack({
        delta: 1
      });
    }
  },

  getData: function() {
    let that = this;
    var url = 'user/bank/card/list';
    var params = {}
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      that.setData({
        List: res.Data
      })
    }); //调用get方法情就是户数
  },

  deleted: function(e) {
    let that = this;
    wx.showModal({
      title: '确定解绑该银行卡吗？',
      success: function(res) {
        if(res.confirm){
          var url = 'user/bank/card/unbind';
          var params = {
            Id: e.currentTarget.dataset.id
          }
          netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
            wx.showToast({
              icon: 'none',
              title: '解绑成功',
            })
            that.getData();
          });
        }
      },
    })
  },

  onPullDownRefresh: function() {
    this.getData();
    wx.stopPullDownRefresh();
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