var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();

Page({
  data: {
    windowHeight: '',
    windowWidth: '',
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
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
    });

    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }

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

    that.init();
  },

  init: function () {
    let that = this;
    shareApi.getShare("/pages/editAddress/editAddress", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    });
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
      let pages = getCurrentPages(); //当前页面
      let prevPage = pages[pages.length - 2]; //上一页面
      let arrTemp = prevPage.data.items;
      arrTemp.forEach(item=>{
        if (item.AddressId == that.data.addressId){
          item.AddressDetails = that.data.address;
          item.AddressName = that.data.InputValue;
          item.DoorNumber = that.data.houseNumber;
          item.Latitude = that.data.lat;
          item.Longitude = that.data.lng;
          item.Tag = that.data.tag;
        }
      });

      prevPage.setData({ //直接给上移页面赋值
        items: arrTemp
      });

      wx.navigateBack({
        dleta :1
      })
    });
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
      let pages = getCurrentPages(); //当前页面
      let prevPage = pages[pages.length - 2]; //上一页面
      prevPage.init();
      wx.navigateBack({
        dleta: 1
      })
    }); //调用get方法情就是户数
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