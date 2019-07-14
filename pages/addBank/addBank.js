var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSuccess: false,//说明弹窗
    phoneNumber:'',//手机号
    phoneCode:'',//手机号验证码
    CardNumber: '',//卡号
    Name: '',//持卡人姓名
    bankName: "中国",//卡类型
    btntext: "(59s)后重新获取",//验证码按钮
    notEdit: false,//验证码按钮是否可点击
    imgCodeShow:false,//图片验证码弹窗
  },
  navtoCard:function() {
    wx.navigateTo({
      url: '/pages/keepCarList/keepCarList',
    })
  },
  //设置name
  setName: function(e) {
    let that = this;
    that.setData({
      Name: e.detail.value
    })
  },
  //设置carnumber值
  carNumberChange: function(e) {
    let that = this;
    that.setData({
      CardNumber: e.detail.value
    })
  },
  //检验银行卡是否有效
  getCarCheck: function() {
    let that = this;
    var url = 'user/bank/card/check';
    var params = {
      CardNumber: that.data.CardNumber
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      console.log(res);
    }, function(msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  //下一步
  next: function() {
    let that = this;
    if (that.data.CardNumber == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入银行卡号!',
      })
    }
    if (that.data.Name == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入姓名!',
      })
    }
    if (that.data.Name != '' && that.data.CardNumber != '') {
      that.getCarCheck();
    }
  },
  //设置手机号
  getPhoneNumber:function(e) {
    this.setData({
      phoneNumber:e.detail.value
    })
  },
  //设置手机号验证码
  getPhoneCode:function() {
    this.setData({
      phoneCode:e.detail.value
    })
  },
  Description: function() {
    this.setData({
      showSuccess: true
    })
  },
  closeded: function() {
    this.setData({
      showSuccess: false
    })
  },
  //关闭图片验证码弹窗
  closeAlert:function() {
    this.setData({
      imgCodeShow:false,
    })
  },
  onShareAppMessage: function() {

  }
})