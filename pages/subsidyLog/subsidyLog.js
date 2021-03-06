var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");

Page({

  data: {
    List: [], //列表数据
    pagecount: 20,
    pageindex: 1,
    userInfo: {}, //个人信息
    cardList: [], //卡券列表
    codeNumber: '', //券码
    codeImg: '', //券码二维码
    codeName: '', //卡的名字
    cardInfo: {}, //返回卡券信息
    showSuccess: false, //完成申请弹窗
    showCode: false, //券码弹出框
    showLog: false, //选择补贴券弹窗
    cardId: -1, //获取卡券Id 为0则是基础卡券
    showPaySuccess: false, //确认补贴金额
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
    shareApi.getShare("/pages/subsidyLog/subsidyLog", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,
      })
    });
    var url = 'user/basesubsidy/record/list';
    var params = {
      PageCount: that.data.pagecount,
      PageIndex: that.data.pageindex
    }
    netUtil.postRequest(url, params, function(res) {
      let arr = res.Data;
      let arr1 = that.data.List;
      if (that.data.pageindex == 1) {
        arr1 = arr;
      } else {
        arr1 = arr1.concat(arr);
      }
      that.setData({
        List: arr1
      })
    })
  },


  bindShowCode: function(e) {
    let that = this;
    let item = e.currentTarget.dataset.item;
    if (item.Status == 1) {
      if (that.selectComponent('#sub')) {
        that.selectComponent('#sub').messageSurePop({
          StoreName: item.StoreName,
          ItemName: item.ItemName,
          Price: item.Price,
          PayAmount: item.PayAmount,
          SubsidyRateAmount: item.SubsidyRateAmount,
          RecordId: item.RecordId,

        });
      }
    } else if (item.Status == 2) {
      if (that.selectComponent('#sub')) {
        that.selectComponent('#sub').qrCodePop({
          QrCode: item.QrCode,
          QrCodeUrl: item.QrCodeUrl,
          Name: item.Name
        });
      }
    } else if (item.Status == 3) {
      if (that.selectComponent('#sub')) {
        that.selectComponent('#sub').sureSuccessPop();
      }
    }
  },

  //删除
  bindDelete: function(e) {
    let that = this;
    let Id = e.currentTarget.dataset.id;
    wx.showModal({
      content: '确认删除 "' + e.currentTarget.dataset.itemname+'" 的补贴记录吗？',
      confirmColor: "#000",
      success: function(res) {
        if (res.confirm) {
          that._delete(Id);
        }
      }
    })
  },
  _delete: function(Id) {
    let that = this;
    var url = 'user/basesubsidy/delete';
    var params = {
      Id: Id
    }
    netUtil.postRequest(url, params, function(res) {
      that.init();
      wx.showToast({
        icon: 'none',
        title: '删除成功',
      })
    })
  },
  //上拉加载更多
  onReachBottom: function() {
    let that = this;
    let temp_page = that.data.pageindex;
    temp_page++;
    that.setData({
      pageindex: temp_page
    });

    that.init();
  },

  //下拉刷新
  onPullDownRefresh: function() {
    let that = this;
    that.setData({
      pageindex: 1
    });
    that.init();
    // 停止下拉动作
    wx.stopPullDownRefresh();
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