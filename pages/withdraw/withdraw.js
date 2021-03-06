var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();

Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    amount: '', //提现金额
    money: '', //可提现金额
    wihdraw: {},
    CardNumber: '',
    fee: '', //服务费
    feeMoney: '', //额外扣除
    isEnterPublic:false,//是否进入客服
    CashServiceFeeRate: '',
    taskList: [], //任务列表
    // '{"api_reply_type": "receive_reply","reply_type":"image","thumb_url": "https://file.guditech.com/Share/Imgs/20191018162632906_ffc08d9c7eb34c968364903add1b1af0.png"}'
  },

  onShow: function() {
    if (this.data.isEnterPublic) {
      this.pubick();

      this.setData({
        isEnterPublic: false,
      })
    }
    
    this._refreshWalletUI();
  },

  _refreshWalletUI: function() {
    let userInfo = wx.getStorageSync('userInfo');

    this.setData({
      money: Number(userInfo.Money / 100).toFixed(2),
      fee: Number(userInfo.CashServiceFeeRate / 100).toFixed(2),
      CashServiceFeeRate: userInfo.CashServiceFeeRate
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
    that.selectComponent("#pop").getData("withdraw");
  },

  init: function() {
    let that = this;
    shareApi.getShare("/pages/withdraw/withdraw", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    })
    
    that.carList();
  },

  // 任务金
  cashLog: function () {
    wx.navigateTo({
      url: '/pages/cashLog/cashLog',
    })
  },

  clear: function() {
    this.setData({
      amount: ''
    })
  },

  changeCard: function(e) {
    wx.navigateTo({
      url: '/pages/bankList/bankList?item=' + e.currentTarget.dataset.item + '&ibd=true',
    })
  },

  amoutChange: function(e) {
    this.doChange(e.detail.value);
  },

  doChange: function(value) {
    this.setData({
      amount: value,
      feeMoney: (Number(value) * this.data.CashServiceFeeRate / 10000).toFixed(2)
    })
  },

  //已领取任务列表
  task: function() {
    let that = this;
    var url = 'user/task/list';
    var params = {
    }
    netUtil.postRequest(url, params, function(res) {
      res.Data.forEach(item => {
        item.PrizeAmountNow = (item.PrizeAmountNow / 100).toFixed(2);
      })

      that.setData({
        taskList: res.Data
      })
    });
  },

  //银行卡列表
  carList: function() {
    let that = this;
    var url = 'user/bank/card/list';
    var params = {};
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      if (res.Data.length >= 1) {
        let wihdraw = res.Data[0];
        that.setData({
          wihdraw: res.Data[0],
          CardNumber: wihdraw.CardNumber.substring(wihdraw.CardNumber.length - 4)
        })
      } else {
        that.setData({
          wihdraw: null
        })
      }

      that.task();
    }); //调用get方法情就是户数
  },

  //点击提现
  GetApply: function(e) {
    let that = this;
    let formId = "";
    if (e.detail.formId != "the formId is a mock one") {
      formId = e.detail.formId;
    }

    wx.showModal({
      title: '请确认提现￥' + that.data.amount,
      success: function(res) {
        if (res.confirm) {
          that.cash(formId);
        }
      }
    })
  },

  //任务提现
  btnTaskCash: function(e) {
    console.log(e)
    let that = this;
    let formId = "";
    if (e.detail.formId != "the formId is a mock one") {
      formId = e.detail.formId;
    }
    let taskId = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '请确认提现￥' + e.currentTarget.dataset.prizeaamountnow,
      success: function(res) {
        if (res.confirm) {
          that.taskCash(taskId, index, formId);
        }
      }
    })
  },

  //任务提现
  taskCash: function(taskId, index, formId) {
    console.log(formId)
    let that = this;
    var url = 'user/task/cash/apply';
    var params = {
      Id: taskId,
      BankCardId: that.data.wihdraw.BankCardId,
    }
    netUtil.postRequest(url, params, function(res) {
      wx.showModal({
        title: '提现成功',
        content: '提现申请成功，等待银行处理' + '\r\n' + '预计 1 个工作日内到账',
        showCancel: false,
        confirmColor: '#3DD6D1',
        confirmText: '知道了',
        success: function(res) {
          let temp = that.data.taskList;
          temp[index].PrizeAmountNowStatus = 2;
          that.setData({
            taskList: temp
          })
        }
      })
    }, null, false,false, false, formId);
  },

  btnScoreCash: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    var url = 'user/task/score/pick';
    var params = {
      Id: e.currentTarget.dataset.id,
    }
    netUtil.postRequest(url, params, function(res) {
      wx.showModal({
        title: '积分提取成功',
        content: '请前往钱包查看',
        showCancel: false,
        confirmColor: '#3DD6D1',
        confirmText: '知道了',
        success: function(res) {
          let temp = that.data.taskList;
          temp[index].PrizeScoreNowStatus = 2;
          that.setData({
            taskList: temp
          })
        }
      })
    });
  },

  //执行任务按钮
  taskclick: function(e) {
    let actionparams = e.currentTarget.dataset.actionparams;
    let actiontype = e.currentTarget.dataset.actiontype;
    if (actiontype == 1) {
      if (actionparams == "/pages/index/index" || actionparams == "/pages/order/order" || actionparams == "/pages/mine/mine") {
        wx.switchTab({
          url: actionparams,
        })
      } else {
        wx.navigateTo({
          url: actionparams,
        })
      }
    } else if (actiontype == 2) {
      wx.navigateTo({
        url: '/pages/WebView/WebView?path=' + actionparams,
      })
    } else if (actiontype == 3) {

    }
  },

  onContacts:function(){
    this.setData({
      isEnterPublic:true,
    });
  },

  //publick
  pubick:function() {
    let that = this;
    let url = 'wechat/publicnumber/follow/get'
    let params = {}
    netUtil.postRequest(url, params, function (res) {
      that.task();
      that._wallet();
      
    },null,false);
  },

  //更新可用余额参数
  _wallet:function() {
    var that = this;
    var url = 'user/wallet';
    var params = {};
    netUtil.postRequest(url, params, function (res) {
      wx.setStorageSync('userInfo', res.Data);
      that._refreshWalletUI();
    }, null, false, false, false)
  },

  //提现
  cash: function(formId) {
    let that = this;
    var url = 'user/cash/apply';
    var params = {
      BankCardId: that.data.wihdraw.BankCardId,
      Amount: Math.floor(that.data.amount * 100),
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      wx.showModal({
        title: '提现成功',
        content: '提现申请成功，等待银行处理' + '\r\n' + '预计 1 个工作日内到账',
        showCancel: false,
        confirmColor: '#3DD6D1',
        confirmText: '知道了',
        success: function(res) {
          that.setData({
            amount: ''
          })
        }
      })
    }, null, true, true, true, formId);
  },

  //点击全部
  all: function() {
    this.doChange(this.data.money);
  },

  withdrawLog: function() {
    wx.navigateTo({
      url: '/pages/withdrawLog/withdrawLog',
    })
  },

  nohaveTo: function() {
    wx.navigateTo({
      url: '/pages/addBank/addBank',
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