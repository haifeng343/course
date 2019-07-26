var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
Page({

  data: {
    hasAddress: true,
    items: [],
    pl: '',
  },
  edit: function(e) {
    let that = this;
    console.log(e)
    // console.log(e)
    let item = e.currentTarget.dataset;
    // wx.navigateTo({
    //   url: '/pages/editAddress/editAddress?address=' + item.address + '&title=' + item.title + '&lat=' + item.lat + '&lng=' + item.lng + '&tag=' + item.tag + '&addressId=' + item.addressid + '&doornumber=' + item.doornumber,
    // })
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success: function (e) {
        console.log(e.tapIndex) //没有item项下的key或index
        if(e.tapIndex==1){
          var url = 'user/address/delete';
          var params = {
            Id: item.id
          }
          netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
            wx.showToast({
              icon: "none",
              title: '删除成功',
            });
            that.init();
          });
        }
        if (e.tapIndex ==0){
          wx.navigateTo({
      url: '/pages/editAddress/editAddress?address=' + item.address + '&title=' + item.title + '&lat=' + item.lat + '&lng=' + item.lng + '&tag=' + item.tag + '&addressId=' + item.addressid + '&doornumber=' + item.doornumber,
    })
        }
      }
    })
  },
  addAddress: function() {
    wx.navigateTo({
      url: '/pages/editAddress/editAddress?ids=' + 1,
    })
  },
  onLoad() {
    this.init();
  },
  init: function() {
    let usertoken = wx.getStorageSync('usertoken');
    if (usertoken) {
      this.getData();
    }
  },
  getData: function() {
    let that = this;
    var url = 'user/address/list';
    var params = {

    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      that.setData({
        items: res.Data
      })
    });
  },
  onLoad: function(e) {
    if (e.recommand) {
      wx.setStorageSync("recommand", e.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare().then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      this.setData({
        obj: res.Data,

      })
    })
    var that = this;
    that.init();
  },

  onPullDownRefresh:function() {
    this.getData();
    wx.stopPullDownRefresh();
  },
  //删除事件

  del: function(e) {
    let that = this;
    wx.showModal({
      title: '地址管理',
      content: '确定要删除此地址吗？',
      success: function(sm) {
        if (sm.confirm) {
          var url = 'user/address/delete';
          var params = {
            Id: e.currentTarget.dataset.id
          }
          netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
            wx.showToast({
              icon: "none",
              title: '删除成功',
            });
            that.init();
          });
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    });
    //调用get方法情就是户数
    // this.data.items.splice(e.currentTarget.dataset.index, 1)
    // this.setData({

    //   items: this.data.items

    // })

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