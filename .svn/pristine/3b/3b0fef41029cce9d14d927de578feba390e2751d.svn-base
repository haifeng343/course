var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();

Page({
  data: {
    statusBarHeight: '',
    windowHeight: '',
    windowHeight: '',
    // 验证手机号
    loginPhone: false,
    loginPwd: false,
    loveChange: true,
    hongyzphone: '',
    // 验证码是否正确
    zhengLove: true,
    huoLove: '',
    getText2: '获取验证码',
    showDialog:false,
  },

  onLoad: function (options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
      statusBarHeight: app.getGreen(0).statusBarHeight,
    });

    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }

    that.init();
  },

  init:function() {
    let that = this;
    shareApi.getShare("/pages/modifyPhone/modifyPhone", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    });
  },

  // 手机验证
  lovePhone: function(e) {
    let phone = e.detail.value;
    this.setData({
      hongyzphone: phone
    })
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      this.setData({
        lovePhone: false
      })
      if (phone.length >= 11) {
        wx.showToast({
          title: '手机号有误',
          icon: 'none',
        })
      }
    } else {
      this.setData({
        lovePhone: true
      })
    }
  },
 
  // 验证码输入
  yanLoveInput: function(e) {
    // let that = this;
    // let yanLove = e.detail.value;
    // let huoLove = this.data.huoLove;
    // that.setData({
    //   yanLove: yanLove,
    //   zhengLove: false,
    // })
    // if (yanLove.length >= 4) {
    //   if (yanLove == huoLove) {
    //     that.setData({
    //       zhengLove: true,
    //     })
    //   } else {
    //     that.setData({
    //       zhengLove: false,
    //     })
    //     wx.showModal({
    //       content: '输入验证码有误',
    //       showCancel: false,
    //       success: function(res) {}
    //     })
    //   }
    // }
  },

  // 验证码按钮
  yanLoveBtn: function() {
    let loveChange = this.data.loveChange;
    let lovePhone = this.data.lovePhone;
    let phone = this.data.hongyzphone;
    let n = 59;
    let that = this;
    if (!lovePhone) {
      wx.showToast({
        title: '手机号有误',
        icon: 'success',
        duration: 1000
      })
    } else {
      if (loveChange) {
        this.setData({
          loveChange: false
        })
        let lovetime = setInterval(function() {
          let str = '(' + n + ')' + '重新获取'
          that.setData({
            getText2: str
          })
          if (n <= 0) {
            that.setData({
              loveChange: true,
              getText2: '重新获取'
            })
            clearInterval(lovetime);
          }
          n--;
        }, 1000);

        //获取验证码接口写在这里
        //例子 并非真实接口
        // app.agriknow.sendMsg(phone).then(res => {
        //   console.log('请求获取验证码.res =>', res)
        // }).catch(err => {
        //   console.log(err)
        // })
      }
    }
  },

  closed:function() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },

  sure:function () {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },

  //form表单提交
  formSubmit(e) {
    let val = e.detail.value;
    var phone = val.phone //电话
    var phoneCode = val.phoneCode //验证码
  },
})