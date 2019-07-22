var netUtil = require("../../utils/request.js"); //require引入
Page({


  data: {
    hiddenmodalput: true,
    code: '',
    Info: {},
    HeadUrl: '',
    NickName: '',
  },
  setCode: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  getData: function() {
    let that = this;
    var url = 'user/info/byrecommandcode';
    var params = {
      RecommandCode: that.data.code,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      that.setData({
        Info: res.Data,
        HeadUrl: res.Data.HeadUrl,
        NickName: res.Data.NickName,
        hiddenmodalput: false,
      })
    });
  },
  sure: function() {
    this.getData();
    // this.setData({
    //   hiddenmodalput: false,
    // })
  },
  cancelM: function(e) {
    this.setData({
      hiddenmodalput: true,
    })
  },

  confirmM: function(e) {
    let that = this;
    var url = 'user/recommandcode/set';
    var params = {
      RecommandCode: that.data.code,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      let pages = getCurrentPages(); //当前页面
      let prevPage = pages[pages.length - 2]; //上一页面
      let HeadUrl= prevPage.data.MyRecommandAccountHeadImgUrl;
      let NickName = prevPage.data.MyRecommandAccountName;
      prevPage.setData({ //直接给上移页面赋值
        MyRecommandAccountHeadImgUrl: that.data.HeadUrl,
        MyRecommandAccountName: that.data.NickName
      });
      that.setData({
        hiddenmodalput: true,
      })
      wx.navigateBack({
        delta: 1
      })
    });
  },
  onShareAppMessage: function() {

  }
})