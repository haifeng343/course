// pages/share/share.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Id:''
  },
  onLoad(options){
    this.setData({
      Id:options.Id
    })
  },
  onShareAppMessage: function(res) {
    console.log(res)
    if(res.form=='button'){
      console.log(res.target,res)
    }
    return {
      title: '来自我的分享',
      path: '/pages/share/share?recommand='+this.data.Id,
      desc: "描述",
      imageUrl: "https://xgt.guditech.com/img/test/share.JPG",
      success: (res) => {
        wx.showToast({
          icon:'none',
          title: '分享成功',
        })
      }
    }
  },
})