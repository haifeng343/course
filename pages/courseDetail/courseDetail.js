var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
var setTime;
const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    windowHeight: app.globalData.windowHeight,
    windowWidth: app.globalData.windowWidth,
    Id: '', //sellid
    List: {},
    Price: '',
    mobile: '',
    teaList: [],
    imgUrls: [],
    autoplay: true, //是否自动播放
    indicatorDots: false, //指示点
    circular: true,
    interval: 5000, //图片切换间隔时间
    duration: 500, //每个图片滑动速度,
    current: 0, //初始化时第一个显示的图片 下标值（从0）index
    type: "", //团单模式
    sheetId: "", //团单Id
    sourceFrom: "", //来源1分类页
    storeId: "", //门店Id
  },
  onLoad: function(options) {
    let that = this;
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare("/pages/courseDetail/courseDetail", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,

      })
    })
    that.setData({
      Id: options.Id || "",
      type: options.type || "",
      sheetId: options.sheetId || "",
      sourceFrom: options.sourceFrom || "",
      storeId: options.storeId || ""
    })
    that.init();
    this._popList();
  },
  //前往购买页面
  goToBuy: function() {
    let that=this;
    if (that.data.sourceFrom == 1) {
      wx.redirectTo({
        url: '/pages/chooseClass/chooseClass?Id=' + that.data.sheetId + '&type=' + that.data.type + "&storeId=" + that.data.storeId,
      })
    } else {
      if (that.data.type == 2) { //商圈模式
        //返回到前两页
        let pages = getCurrentPages();
        let pagesPre2 = pages[pages.length - 3];

        pagesPre2.setData({
          isLoad:true,
          storeIdGotoTemp: that.data.storeId
        });
        wx.navigateBack({
          delta: 2
        });
      }
    }
  },
  //启动弹窗关闭定时器
  closeInterval: function(closeTime, index) {
    let that = this;
    if (setTime != null) {
      clearInterval(setTime);
    }
    if (closeTime <= 0) {
      return;
    }
    setTime = setInterval(function() {
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
  _popList: function() {
    let that = this;
    var url = 'user/pop/list';
    var params = {
      GroupToken: 'courseDetail',
    }
    netUtil.postRequest(url, params, function(res) {
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
  popclick: function(e) {
    let that = this;
    console.log(e);
    let actiontype = e.currentTarget.dataset.actiontype;
    let actionparams = e.currentTarget.dataset.actionparams;
    let executeparams = e.currentTarget.dataset.executeparams;
    let index = e.currentTarget.dataset.index;
    let popId = e.currentTarget.dataset.popid;
    if (executeparams == 'receiveTasks') {
      that.receiveTasks(popId, function() {
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
  shutDown: function(e) {
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
    this.getData();
  },
  callPhone: function() {
    let that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.mobile,
    })
  },
  getData: function() {
    var that = this;
    var url = 'sheet/item/details';
    var params = {
      Longitude: 0,
      Latitude: 0,
      Id: that.data.Id
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调、
      that.setData({
        List: res.Data,
        mobile: res.Data.Mobile,
        Price: Number(res.Data.Price / 100).toFixed(2),
        teaList: res.Data.TeacherList,
        imgUrls: res.Data.ItemImgList
      })
    }); //调用get方法情就是户数
  },
  swiperChange: function(e) {
    this.setData({
      current: e.detail.current
    })
  },
  allTeacher: function(e) {
    wx.navigateTo({
      url: '/pages/allTeacher/allTeacher?Id=' + e.currentTarget.dataset.id,
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