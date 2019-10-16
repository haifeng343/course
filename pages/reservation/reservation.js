var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
Page({

  data: {
    showSuccess: false, //预约成功弹窗
    Id: '', //具体Id
    storeId: '', //门店Id
    itemId:'',//课程Id
    Info: {}, //预约课程详情
    mobile:'',//获取手机号
    childName:'',//获取孩子姓名
    childAge:'',//获取孩子年龄
    appointmentType: 1,//预约类型1.与老师协商 2.指定课程表
    appointmentId: '',//预约排课表Id
    somethimg:'',//下一页面返回传递课程名称
    time: '',//下一页面返回传递时间
  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      Id: options.id || '',
    })
    that.init();
    that._getExtra();
  },
  init: function() {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    shareApi.getShare("/pages/reservation/reservation", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
        mobile: userInfo.Mobile
      })
    })
  },
  // 获取预约记录
  _getExtra: function() {
    let that = this;
    var url = 'appointment/extra/info';
    var params = {
      Id: that.data.Id,
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        Info: res.Data,
      })
      if (res.Data) {
        wx.setNavigationBarTitle({
          title: '预约课程-' + res.Data.StoreName,
        })
      }
    })
  },
  //获取孩子姓名
  hasChildName:function(e) {
    this.setData({
      childName:e.detail.value
    })
  },
  //获取孩子年龄
  hasChildAge:function(e) {
    this.setData({
      childAge:e.detail.value
    })
  },
  //预约时间
  navtoAppointTime: function() {
    let that = this;
    wx.navigateTo({
      url: '/pages/appointment/appointment?Id=' + that.data.Id + '&storeId=' + that.data.Info.StoreId + '&itemId=' + that.data.Info.ItemId+ '&type=' + that.data.appointmentType,
    })
  },

  //订单课程预约申请
  shenqing: function() {
    let that = this;
    var url = 'appointment/apply';
    var params = {
      Id: that.data.Id,
      AppointmentMobile:that.data.mobile,
      ChildName: that.data.childName,
      ChildAge: that.data.childAge,
      AppointmentType: that.data.appointmentType,
      AppointmentId: that.data.appointmentType==1?0:that.data.appointmentId,
    }
    netUtil.postRequest(url, params, function (res) {
      that.setData({
        showSuccess: true
      })
    })

  },

  closeded: function() {
    this.setData({
      showSuccess: false
    })
    let pages = getCurrentPages();
    let befoPage = pages[pages.length-2];
    befoPage.getData();
    wx.navigateBack({
      delta:1
    })
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