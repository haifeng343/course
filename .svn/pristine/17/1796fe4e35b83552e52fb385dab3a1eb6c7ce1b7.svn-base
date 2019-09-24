var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
var setTime;
const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    windowHeight: app.globalData.windowHeight,
    windowWidth: app.globalData.windowWidth,
    imgUrls: [],
    autoplay: true, //是否自动播放
    indicatorDots: false, //指示点
    circular: true,
    interval: 5000, //图片切换间隔时间
    duration: 500, //每个图片滑动速度,
    current: 0, //初始化时第一个显示的图片 下标值（从0）index
    storeId: '', //门店ID
    groupId: '', //分组Id
    Info: {},
    type: "",//团单模式
    sheetId:"",//团单Id
  },
  onLoad: function(options) {
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare("/pages/mechanism/mechanism", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      this.setData({
        obj: res.Data,

      })
    })
    this.setData({
      storeId: options.storeId || '',
      groupId: options.groupId || '',
      type: options.type || "",
      sheetId:options.sheetId||""
    })
    this.init();
    this._popList();
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
      GroupToken: 'mechanism',
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
  call: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile,
    })
  },
  init: function() {
    let that = this;
    var url = 'sheet/store/details';
    var params = {
      GroupId: that.data.groupId,
      StoreId: that.data.storeId,
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        Info: res.Data
      })
    }, null, false, false, false);
  },
  longtap: function() {
    console.log(564164168541)
  },
  courseDetail: function(e) {
    let storeid = this.data.storeId + 'NUV' + this.data.groupId
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?Id=' + e.currentTarget.dataset.id + '&type=' + this.data.type + '&sheetId=' + this.data.sheetId + '&storeId=' + storeid,
    })
  },
  onPullDownRefresh: function() {
    this.init();
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