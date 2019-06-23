// pages/mine/mine.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contents: '这是可以复制的文字,粘贴后即可看到效果',
    synctable: [{
      index: 1685,
      name: '伦敦桥'
    }, {
      index: 1686,
      name: '大海'
    }, {
      index: 1687,
      name: '大山'
    }, {
      index: 1688,
      name: '山海经'
    }, {
      index: 1689,
      name: '波利亚'
    }]
  },
  integral:function() {
    wx.navigateTo({
      url: '/pages/integralLog/integralLog',
    })
  },
  callUs:function() {
    wx.navigateTo({
      url: '/pages/callUs/callUs',
    })
  },
  setting:function() {
    wx.navigateTo({
      url: '/pages/setting/setting',
    })
  },
  invite:function() {
    wx.navigateTo({
      url: '/pages/invite/invite',
    })
  },
  onShareAppMessage: function () {

  }
})