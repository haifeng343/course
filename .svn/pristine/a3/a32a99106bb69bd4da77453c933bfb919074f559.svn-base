var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
Page({

  data: {
    pagecount:4,
    page:1,
    List:[],
  },

  onLoad: function (options) {
    let that = this;
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare().then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,

      })
    })
    that.init();
  },
  init: function () {
    let that = this;
    var url = 'cart/list';
    var params = {
      PageCount: that.data.pagecount,
      PageIndex: that.data.page,
    }
    netUtil.postRequest(url, params, function (res) { 
      let arr = that.data.List;
      let arr1 = res.Data;
      if(that.data.page==1){
        arr = arr1
      }else{
        arr = arr.concat(arr1)
      }
      that.setData({
        List:arr
      })
    })
  },
  //删除购物车
  deleteCard:function(e){
    let that = this;
    console.log(e)
    wx.showModal({
      title: '确认删除',
      content: '是否删除该订单？',
      success:function(res) {
        if(res.confirm){
          var url = 'cart/delete';
          var params = {
            Id: e.currentTarget.dataset.id,
          }
          netUtil.postRequest(url, params, function (res) {
            wx.showToast({
              icon:'none',
              title: '成功删除',
            })
            let thisList = that.data.List;
            let tempArr = thisList.filter(f=>{
              return f.CartId == e.currentTarget.dataset.id
            });
            if (tempArr.length>0){
              let tempIndex = thisList.indexOf(tempArr[0]);
              thisList.splice(tempIndex, 1);
            }

            that.setData({
              List: thisList
            });
          })
        }
      }
    })
    
  },
  onPullDownRefresh: function () {
    this.setData({
      page:1
    })
    this.init();
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    let temp = this.data.page;
    temp++;
    this.setData({
      page: temp
    })
    this.init();
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