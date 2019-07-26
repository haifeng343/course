var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
Page({

  data: {
    PicUrl: '',
    Mobile: '',
    ids: '',
    isShow: false,
    imgCodeShow: false,
    NumberCountDown: 0,
    Remark: '',
    imgUrl: '',
    VerifyCode: '', //发送验证码
    PicVerifycode: '', //验证码
    btntext: '获取验证码',
    notEdit: false,
    ActionCode: '', //操作码
  },
  closeAlert: function() {

  },
  getCode: function(e) {
    this.setData({
      Mobile: e.detail.value
    })
  },
  onLoad(options) {
    var that = this;
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
    that.setData({
      // Mobile: options.phone,
      ids: options.ids
    })
    if (options.ids == 1) {
      wx.setNavigationBarTitle({
        title: '修改手机号',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '绑定手机号',
      })
    }
  },
  init: function () {
    
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
  cendCode: function(e) {
    let that = this;
    var val = e.detail.value;
    that.setData({
      VerifyCode: val
    })
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
  //发送验证码
  sendCode() {
    let that = this;
    var url = 'user/sendverifycode';
    var params = {
      Phone: that.data.Mobile,
      CodeType: 1,
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
          icon: 'none',
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
  SMSVerifyCodeLogin: function() {
    let that = this;
    var url = 'user/phone/bind';
    var params = {
      Phone: that.data.Mobile,
      VerifyCode: that.data.VerifyCode,
      ActionCode: that.data.ActionCode
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      wx.showToast({
        icon: 'none',
        title: that.data.ids == 1 ? "修改成功!" : "绑定成功!"
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 500)
    }, function(msg) { //onFailed失败回调
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
  closed: function() {
    let that = this;
    that.setData({
      isShow: false,
    })
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