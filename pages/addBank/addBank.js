var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Icar: {}, //银行卡类型
    next: true, //下一步是否显示
    showSuccess: false, //说明弹窗
    phoneNumber: '', //手机号
    PicVerifycode: '', //手机号验证码
    CardNumber: '', //卡号
    Name: '', //持卡人姓名
    bankName: "中国", //卡类型
    btntext: "获取验证码", //验证码按钮
    notEdit: false, //验证码按钮是否可点击
    imgCodeShow: false, //图片验证码弹窗
    imgCodeUrl:'',//图片验证码地址
    ActionCode:'',//操作码
    tips:false,//验证码发送提示
    carShowSuccess:false,//绑定成功
  },
  navtoCard: function() {
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

      that.setData({
        next: false,
        bankName: res.Data.BankName + res.Data.CardBreed,
        Icar: res.Data,
      })
    }, function(msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  //获取图片验证码
  codeyan: function() {
    let that = this;
    var url = 'user/picverifycode';
    var params = {
      Phone: that.data.phoneNumber,
      CodeType: 2,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      if (res.ErrorCode == 0) {
        that.setData({
          imgCodeShow: true,
          imgCodeUrl:res.Data
        })
      }
    }, function(msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  //发送验证码
  sendCode() {
    let that = this;
    var url = 'user/sendverifycode';
    var params = {
      Phone: that.data.phoneNumber,
      CodeType: 2,
      PicVerifycode: that.data.PicVerifycode
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      that.setData({
        ActionCode: res.Data
      })
    }, function(msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  codetime() { // 点击获取验证码

    var _this = this
    var coden = 60
    var codeV = setInterval(function() {
      _this.setData({
        btntext: '重新获取' + (--coden) + 's'
      })
      if (coden >= 0) {
        _this.setData({
          notEdit: true
        })
      } else {
        _this.setData({
          notEdit: false
        })
      }
      if (coden == -1) { // 清除setInterval倒计时，这里可以做很多操作，按钮变回原样等
        clearInterval(codeV)
        _this.setData({
          btntext: '获取验证码'
        })
      }
    }, 1000) //  1000是1秒
  },
  getSMSCode: function() {
    //检查图片验证码是否正确
    let that = this;
    var url = 'user/picverifycode/check';
    var params = {
      Phone: that.data.phoneNumber,
      CodeType: 2,
      PicVerifycode: that.data.PicVerifycode
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      console.log(res);
      if (res.ErrorCode == 0) {
        wx.showToast({
          icon: 'none',
          title: "验证码已发送",
        })
        that.setData({
          imgCodeShow: false,
          tips:true,
        })
        that.codetime();
        that.sendCode();
      }
    }, function(msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
    // that.setData({
    //   imgCodeShow: false,
    // })
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
  //邦定手机号
  binding:function(){
    let that = this;
    var url = 'user/bank/card/bind';
    var params = {
      RealName: that.data.Name,
      CardNumber: that.data.CardNumber,
      Mobile:that.data.phoneNumber,
      VerifyCode: that.data.phoneCode,
      ActionCode: that.data.ActionCode
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      wx.showToast({
        icon: 'none',
        title: "绑定成功!"
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
        that.setData({
          carShowSuccess:true,
        })
      }, 500)
    }, function (msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  //设置手机号
  getPhoneNumber: function(e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  //设置手机号验证码
  getPhoneCode: function(e) {
    this.setData({
      phoneCode: e.detail.value
    })
  },
  //设置图片验证码
  codeText:function(e){
    this.setData({
      PicVerifycode: e.detail.value
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
  closeAlert: function() {
    this.setData({
      imgCodeShow: false,
    })
  },
  onShareAppMessage: function() {

  }
})