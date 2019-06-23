// pages/editAddress/editAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    InputValue:'西溪国际商务中心',
    houseNumber:'8号楼201室',
    tag:'谁家',
    currentSelect:'home',
  },
  selectHome:function(e) {
    this.setData({
      currentSelect: e.currentTarget.dataset.id
    })
  },
  selectCompany: function (e) {
    this.setData({
      currentSelect: e.currentTarget.dataset.id
    })
  },
  onShareAppMessage: function () {

  }
})