
var netUtil = require("../../utils/request.js"); //require引入
Page({

 
  data: {
    Longitude:"",
    Latitude:"",
    GroupList: [],
    arr:[],
    color: '#ED8D6D',
    bgcolor: '#FCF4E7',
    checked:false,
    detailCent:{},
    text:"",
    RelId:[],
  },
  onLoad(options){
    let that = this;
    that.setData({
      Id : options.Id
    })
    that.getData();
  },
  getData:function() {
    var that = this;
    var url = 'sheet/details';
    var params = {
      Longitude: that.data.Longitude,
      Latitude: that.data.Latitude,
      Id: that.data.Id
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调、
      that.setData({
        GroupList: res.Data.GroupList,
        detailCent: res.Data,
      })
      for (let a of that.data.GroupList) {
        if (a.MinCount != 0) {
          that.setData({
            text: "最多选" + a.MaxCount + '个，最少' + a.MinCount + '个'
          })
        } else if (a.MaxCount >= a.ItemList.length) {
          that.setData({
            text: "以下课程包含全部"
          })
        } else {
          that.setData({
            text: "以下课程" + a.ItemList.length + '选' + a.MaxCount
          })
        }
      }
    }, function (msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  //计算团单项目选择购买价格
  hasMoney:function(){
    var that = this;
    var url = 'sheet/buy/price';
    var params = {
      SheetId: that.data.Id,
      RelId: that.data.RelId
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调、
      that.setData({
       
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
  //是否
  checkedTap: function (e) {
    let that = this;
    that.hasMoney();
  },
  courseDetail: function() {
    var checked = this.data.checked;
    this.setData({
      "checked": !checked
    })
  },
  paybtn:function() {
    wx.navigateTo({
      url: '/pages/payOrder/payOrder',
    })
  },
  onShareAppMessage: function () {

  }
})