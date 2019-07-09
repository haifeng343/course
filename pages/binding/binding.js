var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    PicUrl: '',
    Mobile: '',
    isShow: false,
    imgCodeShow: false,
    NumberCountDown: 0,
    Remark: '',
    imgUrl: '',
    VerifyCode: '',//发送验证码
    PicVerifycode: '', //验证码
    btntext: '获取验证码',
    notEdit: false,
    ActionCode: '',//操作码
  },
  closeAlert: function() {

  },
  onLoad(options) {
    var that = this;
    console.log(options)
    that.setData({
      Mobile: options.phone
    })
  },
  codeyan: function() {
    let that = this;

    //获取图片验证码
    var url = 'user/picverifycode';
    var params = {
      Phone: that.data.Mobile,
      CodeType: 1,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      if (res.ErrorCode == 0) {
        that.setData({
          PicUrl: res.Data.replace(/\\/, '/')
        })
        that.setData({
          imgCodeShow: true,
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
  //图片验证码 
  codeText: function(e) {
    let that = this;
    var val = e.detail.value;
    that.setData({
      PicVerifycode: val
    })
  },
  //获取验证码
  cendCode:function(e){
    let that = this;
    var val = e.detail.value;
    that.setData({
      VerifyCode: val
    })
  },
  //验证码倒计时
  codetime() { // 点击获取验证码
    //这里是要调api接口的，我这里就假装已经调成功了，返回200了
    var _this = this
    var coden = 60 // 定义60秒的倒计时
    var codeV = setInterval(function() {
      _this.setData({ // _this这里的作用域不同了
        btntext: '重新获取' + (--coden) + 's'
      })
      if (coden >= 0) {
        _this.setData({
          notEdit: true
        })
      }else{
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
  //发送验证码
  sendCode() {
    let that = this;
    var url = 'user/sendverifycode';
    var params = {
      Phone: that.data.Mobile,
      CodeType: 1,
      PicVerifycode: that.data.PicVerifycode
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      that.setData({
        ActionCode : res.Data
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
  getSMSCode: function() {
    //检查图片验证码是否正确
    let that = this;
    var url = 'user/picverifycode/check';
    var params = {
      Phone: that.data.Mobile,
      CodeType: 1,
      PicVerifycode: that.data.PicVerifycode
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      console.log(res);
      if (res.ErrorCode == 0) {
        wx.showToast({
          icon:'none',
          title: "验证码已发送",
        })
        that.setData({
          imgCodeShow: false,
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
  //绑定
  SMSVerifyCodeLogin:function(){
    let that = this;
    var url = 'user/phone/bind';
    var params = {
      Phone: that.data.Mobile,
      VerifyCode: that.data.VerifyCode,
      ActionCode: that.data.ActionCode
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      console.log(res);
      if (res.ErrorCode == 0) {
        wx.showToast({
          icon: 'none',
          title: "绑定成功!",
        })
       wx.navigateBack({
         delta:1
       })
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
  closeAlert: function() {
    let that = this;
    that.setData({
      imgCodeShow: false,
    })
  },
  closed:function(){
    let that = this;
    that.setData({
      isShow: false,
    })
  }
})