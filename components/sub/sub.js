var netUtil = require("../../utils/request.js"); //require引入
// components/sub/sub.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showSuccess: false, //完成申请弹窗
    showCode: false, //券码弹出框
    showPaySuccess: false, //确认补贴金额
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //补贴二维码弹窗初始化
    qrCodePop: function (tempResult) {
      let that = this;
      that.setData({
        codeImg: tempResult.QrCodeUrl,
        codeNumber: tempResult.QrCode,
        codeName: tempResult.Name,
        cardId:"",
        showCode: true
      })
    },
    //信息确认弹窗初始化
    messageSurePop: function (tempResult) {
      let that = this;
      that.setData({
        cardInfo: {
          StoreName: tempResult.StoreName,
          ItemName: tempResult.ItemName,
          Price: tempResult.Price,
          PayAmount: tempResult.PayAmount,
          SubsidyRateAmount: tempResult.SubsidyRateAmount
        },
        cardId: tempResult.RecordId,
        showPaySuccess: true
      })
    },
    //确认信息成功弹窗初始化
    sureSuccessPop: function () {
      let that = this;
      that.setData({
        showSuccess: true,
        cardId: "",
      });
    },

    //客户点击确认按钮同意函数（1.完成确定课程 2.信息有误 3.成交确认）
    CustomSureClick(type) {
      let that = this;
      that.userCustomer(type, function (res) {
        if (type == 1) {
          that.setData({
            showCode: false
          })
        } else if (type == 2) {
          that.setData({
            showPaySuccess: false
          })
        } else if (type == 3) {
          that.setData({
            showPaySuccess: false
          })
        } else {
          return;
        }
        if (res.Status == 1) { //信息确认弹窗初始化
          that.messageSurePop({
            StoreName: res.StoreName,
            ItemName: res.ItemName,
            Price: res.Price,
            PayAmount: res.PayAmount,
            SubsidyRateAmount: res.SubsidyRateAmount,
            RecordId: res.RecordId
          });
        } else if (res.Status == 2) { //跳转到补贴二维码弹窗初始化
          that.qrCodePop({
            QrCodeUrl: res.QrCode,
            QrCodeUrl: res.QrCodeUrl,
            Name: res.Name
          });
        } else if (res.Status == 3) { //确认信息成功弹窗初始化
          that.sureSuccessPop();
        } else {
          wx.showToast({
            icon: 'none',
            title: '补贴已完成',
          })
          return;
        }
      });
    },
    //用户确认
    userCustomer: function (type, onSuccess) {
      let that = this;
      var url = 'user/customer/confirm';
      var params = {
        QrCode: that.data.codeNumber,
        RecodeId: that.data.cardId,
        Type: type,
      }
      netUtil.postRequest(url, params, function (res) {
        if (onSuccess) {
          onSuccess(res.Data)
        }
      },
        null,
        false)
    },

    //完成确定课程
    classSure: function () {
      let that = this;
      that.CustomSureClick(1);
    },
    //关闭课程确认
    classEor: function () {
      this.setData({
        showCode: false,
      })
    },
    // 点击信息有误
    bindMessageEor: function () {
      let that = this;
      that.CustomSureClick(2);
    },
    // 成交确认
    bindSureSend: function () {
      let that = this;
      that.CustomSureClick(3);
    },
    closeded: function () {
      this.setData({
        showSuccess: false
      })
    },








    closePayDialog: function () {
      this.setData({
        showPaySuccess: false
      })
    },

  }
})
