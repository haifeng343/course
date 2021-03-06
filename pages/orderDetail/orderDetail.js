var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();

Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    showCode: true, //条形码弹窗
    showDialog: true, //退款失败 查看原因弹窗
    showSuccess: false, //退款详情 成功弹窗
    reservationShow:false,//预约详情弹出框
    Id: '',//订单Id
    Status: '',//状态
    kd: '',//页面跳转
    ItemList: [],//项目列表
    detail: {},//项目详情
    PayAmount: '',//支付金额
    RefundFailReason: '',//退款失败说明
    formId: "",
    reserVationInfo:{},//预约详情
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

    that.setData({
      Id: options.Id || "",
      Status: options.status || "",
      kd: options.kd || "",
      formId: options.formId || "",
    })

    that.init();
  },

  init: function() {
    let that = this;
    shareApi.getShare("/pages/orderDetail/orderDetail", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    }) 
    
    that.getData();
  },
  
  getData: function() {
    var that = this;
    var url = 'order/details'
    var params = {
      Id: that.data.Id,
      Status: that.data.Status,
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        detail: res.Data,
        ItemList: res.Data.ItemList,
        PayAmount: Number(res.Data.PayAmount / 100).toFixed(2),
        RefundFailReason: res.Data.RefundFailReason
      })
    }, null, false, false, false, that.data.formId);
  },

  //条形码弹窗
  codeShow: function() {
    this.setData({
      showCode: false
    })
  },

  dialogShow: function() {
    this.setData({
      showCode: true
    })
  },

  //退款失败 查看原因弹窗
  errorShow: function() {
    let that = this;
    wx.showModal({
      title: '退款失败详情',
      content: that.data.RefundFailReason,
      showCancel: false,
    })
  },

  //取消退款
  cancelOrder: function(e) {
    console.log(e)
    let that = this;
    var url = 'order/refund/cancel';
    var params = {
      Id: e.currentTarget.dataset.id,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      let pages = getCurrentPages(); //当前页面
      let prevPage = pages[pages.length - 2]; //上一页面
      // console.log(prevPage.data.modelList);return;
      if (that.data.kd == 3) {
        let tempList = prevPage.data.modelList;
        tempList.forEach(x => {
          x.list.forEach(item => {
            if (that.data.Id == item.OrderId) {
              if (x.navbarActiveIndex == 3) {
                item.UseStatus = 9;
              } else {
                item.UseStatus = 1;
              }
            }
          })
        })
        prevPage.setData({ //直接给上移页面赋值
          modelList: tempList,
        });
      }
      wx.navigateBack({
        delta: 1
      });
    }); //调用get方法情就是户数
  },

  //重新退款
  Refund: function(e) {
    wx.navigateTo({
      url: '/pages/refund/refund?OrderId=' + e.currentTarget.dataset.orderid + '&kmd=2' + '&kd=' + this.data.kd,
    })
  },

  closed: function() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },

  //退款详情 成功弹窗
  showSucess: function() {
    this.setData({
      showSuccess: true
    })
  },
  cancelReser: function(e) {
    let that = this;
    let formId = "";
    if (e.detail.formId != "the formId is a mock one") {
      formId = e.detail.formId;
    }
    wx.showModal({
      content: '确认取消 "' + e.currentTarget.dataset.name +'" 课程的预约吗？',
      confirmText: "确认",
      confirmColor:"#000",
      success:function(res) {
        if(res.confirm){
          var url = 'appointment/cancel';
          var params = {
            Id: e.currentTarget.dataset.id,
          }
          netUtil.postRequest(url, params, function (res) {
            wx.showToast({
              icon: "none",
              title: '取消预约成功',
            })
            that.getData();
          }, null, false, false, false, formId)
        }
      }
    })
  },
  //预约被取消详情
  // reservationDetail:function(){
  //   wx.showModal({
  //     title: '预约取消详情',
  //     content: '此时间无课程'+'\r\n'+'是的',
  //     showCancel:false,
  //     confirmText: "知道了",
  //     confirmColor:"#000",
  //     success:function(res) {
  //       if(res.confirm){

  //       }
  //     }
  //   })
  // },
  //预约详情弹出框
  reservationDialog:function(e) {
    let Id = e.currentTarget.dataset.id;
    this._getServerDetail(Id);
  },
  //获取预约详情
  _getServerDetail: function (Id) {
    let that = this;
    var url = 'appointment/details';
    var params = {
      Id: Id,
    }
    netUtil.postRequest(url, params, function (res) {
      that.setData({
        reserVationInfo:res.Data,
        reservationShow: true
      })
    });
  },
  reservationClosed:function(){
    this.setData({
      reservationShow: false
    })
  },
  //预约课程 / 重新预约
  navtoReser:function(e) {
    console.log(e)
    let that = this;
    let formId = "";
    if (e.detail.formId != "the formId is a mock one") {
      formId = e.detail.formId;
    }
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo.Mobile) {
      wx.navigateTo({
        url: '/pages/reservation/reservation?id=' + e.currentTarget.dataset.id + '&formId=' + that.data.formId,
      })
    }else{
      wx.navigateTo({
        url: '/pages/gobind/gobind'
      })
    }
  },
  onPullDownRefresh: function() {
    this.getData();
    wx.stopPullDownRefresh();
  },

  closeded: function() {
    this.setData({
      showSuccess: !this.data.showSuccess
    });
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