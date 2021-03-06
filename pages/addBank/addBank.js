var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: '',
    windowWidth: '',
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
    codePhone:'',//验证码发送的手机号
  },
  
  navtoCard: function() {
    wx.navigateTo({
      url: '/pages/keepCarList/keepCarList',
    })
  },

  clear:function() {
    this.setData({
      CardNumber:'',
    })
  },

  cleard:function() {
    this.setData({
      phoneNumber:''
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
        BankIconUrl: res.Data.BankIconUrl
      })
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
    netUtil.postRequest(url, params, function(res) { 
      that.setData({
        imgCodeShow: true,
        imgCodeUrl:res.Data,
        PicVerifycode:'',
      })
    }); 
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
      wx.showToast({
        icon:'none',
        title: '验证码已发送',
      })
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
          codePhone:that.data.phoneNumber,
        })
        that.codetime();
        that.sendCode();
      }
    }); 
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
    console.log(params);
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      wx.showModal({
        content: '绑定成功',
        showCancel:false,
        confirmColor: '#3DD6D1',
        confirmText: '知道了',
        success: function (res) {
          var pages = getCurrentPages();
          var beforePage = pages[pages.length - 2];
          beforePage.init();
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }); 
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
    wx.showModal({
      title: '持卡人说明',
      content: '为了资金安全，只能绑定当前持卡人的银行卡',
      showCancel: false,
      confirmColor: '#3DD6D1',
      confirmText: '知道了',
    })
  },

  //关闭图片验证码弹窗
  closeAlert: function() {
    this.setData({
      imgCodeShow: false,
      PicVerifycode:false,
    })
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

    that.init();
  },

  init: function () {
    let that = this;
    shareApi.getShare("/pages/addBack/addBack", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
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