var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
Page({

  data: {
    showSuccess: false, //完成申请弹窗
    showCode: false, //券码弹出框
    showLog: false, //选择补贴券弹窗
    cardId: -1, //获取卡券Id 为0则是基础卡券
    showPaySuccess: false, //确认补贴金额
    userInfo: {}, //个人信息
    cardList: [], //卡券列表
    codeNumber: '', //券码
    codeImg: '', //券码二维码
    codeName: '', //卡的名字
    cardInfo: {}, //返回卡券信息
    showDic:false,//补贴券说明
  },
  onLoad: function(options) {
    this.init();
  },

  init: function() {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    that.setData({
      userInfo: userInfo
    })
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare("/pages/snatch/snatch", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,
      })
    });
  },

  bindBoost:function() {
    let userInfo = wx.getStorageSync('userInfo');
    if(userInfo && userInfo.RecommandCode){
      wx.navigateTo({
        url: '/pages/boost/boost?recommand='+userInfo.RecommandCode,
      })
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  //补贴二维码弹窗初始化
  qrCodePop: function(tempResult) {
    let that = this;
    console.log(tempResult)
    that.setData({
      codeImg: tempResult.QrCodeUrl,
      codeNumber: tempResult.QrCode,
      codeName: tempResult.Name,
      showCode: true
    })
  },
  //信息确认弹窗初始化
  messageSurePop: function(tempResult) {
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
  sureSuccessPop: function() {
    let that = this;
    that.setData({
      showSuccess: true
    });
  },

  //客户点击确认按钮同意函数（1.完成确定课程 2.信息有误 3.成交确认）
  CustomSureClick(type) {
    let that = this;
    that.userCustomer(type, function(res) {
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
        if (that.selectComponent('#sub')) {
          that.selectComponent('#sub').messageSurePop({
            StoreName: res.StoreName,
            ItemName: res.ItemName,
            Price: res.Price,
            PayAmount: res.PayAmount,
            SubsidyRateAmount: res.SubsidyRateAmount,
            RecordId: res.RecordId
          });
        }
        
      } else if (res.Status == 2) { //跳转到补贴二维码弹窗初始化
        if (that.selectComponent('#sub')) {
          that.selectComponent('#sub').qrCodePop({
            QrCodeUrl: res.QrCode,
            QrCodeUrl: res.QrCodeUrl,
            Name: res.Name
          });
        }
      } else if (res.Status == 3) { //确认信息成功弹窗初始化
        if (that.selectComponent('#sub')) {
          that.selectComponent('#sub').sureSuccessPop();
        }
      } else {
        wx.showToast({
          icon: 'none',
          title: '补贴已完成',
        })
        return;
      }
    });
  },

  //基础补贴说明
  bindDec: function() {
    let that = this;
    if (that.selectComponent('#dialog')) {
      that.selectComponent('#dialog').init('基础补贴说明',"SubsidyRules");
    }
  },

  closeDic:function() {
    this.setData({
      showDic:false
    })
  },
  //获取有效的补贴卡券
  hasCardList: function() {
    let that = this;
    var url = 'ticket/list';
    var params = {
      TypeId: 4,
      UseStatus: 1,
      PageCount: 1000,
      PageIndex: 1
    }
    netUtil.postRequest(url, params, function(res) {
        let arr = res.Data == null ? [] : res.Data;
        let subside = that.data.userInfo.TempSubsidyRate;
        if (subside > that.data.userInfo.TempSubsidyRateMax) {
          subside = that.data.userInfo.TempSubsidyRateMax
        }

        if (that.data.userInfo.BaseSubsidyRate > 0 || subside > 0) {
          arr.unshift({
            Id: 0,
            CardName: '账户基础补贴',
            SubsidyRate: (that.data.userInfo.BaseSubsidyRate + subside) * 1.0 / 100 + '%'
          });
        }

        if (arr.length > 1) {
          that.setData({
            cardList: arr,
            cardId: -1,
            codeName: ''
          })
        } else if (arr.length > 0) {
          that.setData({
            cardList:arr,
            cardId:arr[0].Id,
            codeName:''
          })

          that.getCode();
        } else {
          wx.showToast({
            icon: 'none',
            title: '暂无可用补贴券',
          })
        }
      },
      null,
      false)
  },
  //获取基础补贴二维码
  hasBasesubsidyCode: function(onSuccess) {
    let that = this;
    var url = 'user/basesubsidy/info';
    var params = {}
    netUtil.postRequest(url, params, function(res) {
        if (onSuccess) {
          onSuccess(res.Data);
        }
      },
      null,
      false)
  },

  //用户确认
  userCustomer: function(type, onSuccess) {
    let that = this;
    var url = 'user/customer/confirm';
    var params = {
      QrCode: that.data.codeNumber,
      RecodeId: that.data.cardId,
      Type: type,
    }
    netUtil.postRequest(url, params, function(res) {
        if (onSuccess) {
          onSuccess(res.Data)
        }
      },
      null,
      false)
  },

  bindShowCode: function() {
    if (this.data.cardList.length>1){
      this.setData({
        showLog: true,
      })
    }
    this.hasCardList();
  },
  closeCodeLog: function() {
    this.setData({
      showLog: false,
      cardId: -1,
    })
  },
  getCode: function() {
    let that = this;
    let tempArr = that.data.cardList;
    tempArr.forEach(item => {
      if (item.Id == that.data.cardId) {
        if (item.Id == 0) {
          that.hasBasesubsidyCode(function(res) {
            if (that.selectComponent('#sub')) {
              that.selectComponent('#sub').qrCodePop({
                QrCodeUrl: res.QrCodeUrl,
                QrCode: res.QrCode,
                Name: item.CardName
              });
              that.setData({
                showLog: false
              })
            }
          });
        } else {
          if (that.selectComponent('#sub')) {
            that.selectComponent('#sub').qrCodePop({
              QrCodeUrl: item.CardQrCodeUrlShow,
              QrCode: item.CardQrCode,
              Name: item.CardName
            });
            that.setData({
              showLog: false
            })
          }
        }

        return;
      }
    })
  },
  
  dialogShow: function() {
    this.setData({
      showCode: false
    })
  },
  changeCheck: function(e) {
    console.log(e)
    this.setData({
      cardId: e.detail.value
    })
  },
  showDesClick: function(e) {
    let that = this;
    let Id = e.currentTarget.dataset.id;
    let tempArr = that.data.cardList;
    tempArr.forEach(item => {
      if (item.Id == Id) {
        item.check = !item.check
      }
    })
    that.setData({
      cardList: tempArr
    })
  },
  subsidyLog: function() {
    wx.navigateTo({
      url: '/pages/subsidyLog/subsidyLog',
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