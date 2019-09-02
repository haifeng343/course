// pages/demo/demo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: ['list1', 'list2', 'list3', 'list4', 'list5',],

    status: 0,
    show:false
  },

  onLoad: function (options) {
    
  },
  getStatus(e) {
    console.log(e)
    this.setData({ status: e.currentTarget.dataset.index, show:true })
  },
  findPosition:function() {
    let that=this;
    that.setData({
      position:'position1'
    });
    // let that = this;
    // wx.getSystemInfo({
    //   success: function (res) {
    //     that.widHeight = res.windowHeight - (res.windowWidth * 90 / 750) + 'px'
    //   },
    // })
  },

  onShareAppMessage: function () {

  }
})