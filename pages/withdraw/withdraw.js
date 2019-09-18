var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
var setTime;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: '', //提现金额
    money: '', //可提现金额
    wihdraw: {},
    CardNumber: '',
    fee: '', //服务费
    feeMoney: '', //额外扣除
    CashServiceFeeRate: '',
    taskList: [], //任务列表
  },
  onShow: function() {
    let wallet = wx.getStorageSync('wallet');
    let CashServiceFeeRate = wx.getStorageSync('userInfo').CashServiceFeeRate;
    this.setData({
      money: Number(wallet.Money / 100).toFixed(2),
      fee: Number(CashServiceFeeRate / 100).toFixed(2),
      CashServiceFeeRate: CashServiceFeeRate
    })
  },
  onLoad(options) {
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare().then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      this.setData({
        obj: res.Data,

      })
    })
    this.init();
    this._popList();
  },
  //启动弹窗关闭定时器
  closeInterval: function (closeTime, index) {
    let that = this;
    if (setTime != null) {
      clearInterval(setTime);
    }
    if (closeTime <= 0) {
      return;
    }
    setTime = setInterval(function () {
      let temp = that.data.popList;
      temp[index].pop = false;
      if (temp.length > index + 1) {
        temp[index + 1].pop = true
        closeTime = temp[index + 1].CloseTime;
        index = index + 1;
      } else {
        clearInterval(setTime);
        closeTime = -1;
        index = index + 1;
      }
      that.setData({
        popList: temp
      })
      that.closeInterval(closeTime, index);
    }, closeTime);
  },
  //弹窗列表
  _popList: function () {
    let that = this;
    var url = 'user/pop/list';
    var params = {
      GroupToken: 'withdraw',
    }
    netUtil.postRequest(url, params, function (res) {
      let temp = res.Data;
      temp.forEach((item, index) => {
        if (index == 0) {
          item.pop = true;
        } else {
          item.pop = false
        }
      })
      that.setData({
        popList: temp,
      });
      if (temp.length > 0) {
        that.closeInterval(temp[0].CloseTime, 0);
      }
    },
      null,
      false,
      false,
      false)
  },
  //点击弹窗图片事件
  popclick: function (e) {
    let that = this;
    console.log(e);
    let actiontype = e.currentTarget.dataset.actiontype;
    let actionparams = e.currentTarget.dataset.actionparams;
    let executeparams = e.currentTarget.dataset.executeparams;
    let index = e.currentTarget.dataset.index;
    let popId = e.currentTarget.dataset.popid;
    if (executeparams == 'receiveTasks') {
      that.receiveTasks(popId, function () {
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
        }
        if (actiontype == 1 || actiontype == 2) {
          let temp = that.data.popList;
          temp[index].pop = false;
          if (temp.length > index + 1) {
            temp[index + 1].pop = true
          }
          that.setData({
            popList: temp
          })
        }
      });
    } else {
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
      }
      if (actiontype == 1 || actiontype == 2) {
        let temp = that.data.popList;
        temp[index].pop = false;
        if (temp.length > index + 1) {
          temp[index + 1].pop = true
        }
        that.setData({
          popList: temp
        })
      }
    }
  },
  //关闭弹窗按钮
  shutDown: function (e) {
    let that = this;
    if (setTime != null) {
      clearInterval(setTime);
    }
    let index = e.currentTarget.dataset.index;
    let temp = that.data.popList;
    temp[index].pop = false;
    if (temp.length > index + 1) {
      temp[index + 1].pop = true;
      that.closeInterval(temp[index + 1].CloseTime, index + 1);
    }
    that.setData({
      popList: temp
    })
  },
  init: function() {
    this.carList();
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
    var params = {

    }
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
  GetApply: function() {
    let that = this;
    wx.showModal({
      title: '请确认提现￥' + this.data.amount,
      success: function(res) {
        if (res.confirm) {
          that.cash();
        }
      }
    })
  },
  //任务提现
  btnTaskCash: function(e) {
    let that = this;
    let taskId = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '请确认提现￥' + e.currentTarget.dataset.prizeaamountnow,
      success: function(res) {
        if (res.confirm) {
          that.taskCash(taskId, index);
        }
      }
    })
  },
  //任务提现
  taskCash: function(taskId, index) {
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
    });
  },
  btnScoreCash:function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    var url = 'user/task/score/pick';
    var params = {
      Id: e.currentTarget.dataset.id,
    }
    netUtil.postRequest(url, params, function (res) {
      wx.showModal({
        title: '提现成功',
        content: '提现申请成功，等待银行处理' + '\r\n' + '预计 1 个工作日内到账',
        showCancel: false,
        confirmColor: '#3DD6D1',
        confirmText: '知道了',
        success: function (res) {
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
  taskclick:function(e) {
    let actionparams = e.currentTarget.dataset.actionparams;
    let actiontype = e.currentTarget.dataset.actiontype;
    if (actiontype==1){
      wx.navigateTo({
        url: actionparams,
      })
    } else if (actiontype == 2){
      wx.navigateTo({
        url: '/pages/WebView/WebView?path=' + actionparams,
      })
    } else if (actiontype == 3) {

    }
  },
  //提现
  cash: function() {
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
    });
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
  cashLog: function() {
    wx.navigateTo({
      url: '/pages/cashLog/cashLog',
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