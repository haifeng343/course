
Page({

  
  data: {
    hiddenmodalput: true,
  },
  sure:function() {
    this.setData({
      hiddenmodalput: false,
    })
  },
  cancelM: function (e) {
    this.setData({
      hiddenmodalput: true,
    })
  },

  confirmM: function (e) {
    this.setData({
      hiddenmodalput: true,
    })
  },
  onShareAppMessage: function () {

  }
})