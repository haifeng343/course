var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    InputValue: '',
    houseNumber: '',
    tag: '',
    address: '',
    lng: '',
    lat: '',
    tagList: [{
      id: 1,
      name: "家"
    }, {
      id: 2,
      name: "公司"
    }, {
      id: 3,
      name: "学校"
    }],
    ids: '',
    addressId:'',

  },
  onLoad(options) {
    let that = this;
    console.log(options)
    if (options.ids == 1) {
      that.setData({
        ids: options.ids
      })
      wx.setNavigationBarTitle({
        title: '增加地址',
      })
    } else {
      that.setData({
        InputValue: options.title,
        lng: options.lng,
        lat: options.lat,
        tag: options.tag,
        houseNumber: options.doornumber,
        addressId: options.addressId,
        address: options.address,
      })
      wx.setNavigationBarTitle({
        title: '编辑地址',
      })
    }
  },
  //编辑
  editSure: function () {
    let that = this;
    var url = 'user/address/modify';
    var params = {
      AddressName: that.data.InputValue,
      AddressDetails: that.data.address,
      Longitude: that.data.lng,
      Latitude: that.data.lat,
      Tag: that.data.tag,
      DoorNumber: that.data.houseNumber,
      AddressId : that.data.addressId
    }
    if (that.data.InputValue == "") {
      wx.showToast({
        icon: "none",
        title: '请填写地址',
      })
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      // console.log(res)
      that.setData({
        List: res.Data
      })
      wx.showToast({
        icon: "none",
        title: '编辑成功',
      })
    }, function (msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  houseName: function (e) {
    this.setData({
      houseNumber: e.detail.value
    })
  },
  menuClick: function (e) {
    console.log(e)
    this.setData({
      tag: e.currentTarget.dataset.name
    })
  },
  searchAddress: function (e) {
    wx.navigateTo({
      url: '/pages/searchAddress/searchAddress',
    })
  },
  //提交
  submitSure: function () {
    let that = this;
    var url = 'user/address/add';
    var params = {
      AddressName: that.data.InputValue,
      AddressDetails: that.data.address,
      Longitude: that.data.lng,
      Latitude: that.data.lat,
      Tag: that.data.tag,
      DoorNumber: that.data.houseNumber
    }
    if (that.data.InputValue == "") {
      wx.showToast({
        icon: "none",
        title: '请填写地址',
      })
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      // console.log(res)
      that.setData({
        List: res.Data
      })
      wx.showToast({
        icon: "none",
        title: '提交成功',
      })
      that.getData();
    }, function (msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  onShareAppMessage: function () {

  }
})