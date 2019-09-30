var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");

const app = getApp();
Page({
  data: {
    windowHeight: '',
    windowWidth: '',
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
    type: "", //团单模式
    sheetId: "", //团单Id
    count: 0, //购买数量
    TotalPrice: -1, //总价
    PrizeAmount: 0, //奖励金
    checkedArr: [], //勾选的数组
    relIdGoto: "", //定位relId
    relId: "", //课程关系Id
    isJump: false, //是否详情页跳转过来
    over:false,
    showTearcher:false,//教师弹窗
    teacherInfo:{},//老师详情
    top:0,
  },
  onShow: function() {
    if (this.data.over == true) {
      wx.showToast({
        icon: "none",
        title: '剩余名额不足'
      })
      this.setData({
        over:false
      });
    }
  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
    });
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare("/pages/mechanism/mechanism", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,

      })
    })
    that.setData({
      storeId: options.storeId || '',
      groupId: options.groupId || '',
      type: options.type || "",
      sheetId: options.sheetId || "",
      relIdGoto: options.relIdGoto || "",
      relId: options.relId || "",
      isJump: options.isJump || false
    })

    that.init();
    that.selectComponent("#pop").getData("mechanism");
  },
  swiperChangeTo: function(e) {
    this.setData({
      current: e.detail.current
    })
  },
  //点击老师获取详情
  tearcherClick:function(e){
    wx.navigateTo({
      url: '/pages/teacherDetail/teacherDetail?id='+e.currentTarget.dataset.id,
    })
  },
  hideTeacher:function(){
    this.setData({
      showTearcher: false,
    })
  },
  //拨打电话
  call: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile,
    })
  },
  //初始化机构信息
  init: function() {
    let that = this;
    var url = 'sheet/store/details';
    var params = {
      GroupId: that.data.groupId,
      StoreId: that.data.storeId,
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        Info: res.Data,
        checkedArr: [],
        TotalPrice: -1,
        count: 0
      })
      if (that.data.relId) {
        that.checkChange({
          RelId: that.data.relId
        });
        that.setData({
          relId: null
        });
      }
    }, null, false, false, false);
  },
  //跳转购物车
  navtoCar: function() {
    wx.setStorageSync('load', true);
    wx.navigateTo({
      url: '/pages/car/car?type=' + this.data.type,
    });
  },
  //勾选
  checkChange: function(e) {
    let that = this;
    let tempInfo = this.data.Info;
    if (that.data.isJump == false) { //本页面点击勾选
      that.setData({
        checkedArr: e.detail.value,
      });
      tempInfo.ItemList.forEach(item => {
        if (e.detail.value.indexOf(item.RelId + '') != -1) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
      that.setData({
        Info: tempInfo
      });
    } else { //其他页面跳转勾选
      that.setData({
        isJump: false
      });
      let tempArr = that.data.checkedArr;
      if (tempArr.indexOf(e.RelId) != -1) {
        return;
      }
      let tempInfo = that.data.Info;
      let over = 0;
      tempInfo.ItemList.forEach(item => {
        if (item.RelId == e.RelId) {
          if (item.RemainCount <= 0) {
            over = 1;
          } else {
            item.checked = true;
          }
        }
      });
      if (over == 1) {
        that.setData({
          over:true
        });
        return;
      }
      tempArr.push(e.RelId);
      that.setData({
        checkedArr: tempArr,
        Info: tempInfo
      });
    }
    that.hasMoney();
  },
  //加入购物车
  addcar: function() {
    var that = this;
    var url = 'cart/add';
    var params = {
      SheetId: that.data.sheetId,
      RelId: that.data.checkedArr,
    }
    netUtil.postRequest(url, params, function(res) {
      that.init(false);
      wx.showToast({
        icon: 'none',
        title: '添加已成功'
      })
    });
  },
  //确认预约
  paybtn: function() {
    let checkedList = [];
    checkedList.push({
      SheetId: this.data.sheetId,
      RelId: this.data.checkedArr
    });

    wx.navigateTo({
      url: '/pages/payOrder/payOrder?checkItem=' + JSON.stringify(checkedList) + '&type=' + this.data.type,
    })
  },
  //计算购买价格
  hasMoney: function() {
    var that = this;
    var url = 'sheet/buy/price';
    var params = {
      SheetId: that.data.sheetId,
      RelId: that.data.checkedArr
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调、
        that.setData({
          Remark: res.Data.Remark,
          TotalPrice: res.Data.TotalPrice == -1 ? -1 : res.Data.TotalPrice * 1.0 / 100,
          PrizeAmount: (res.Data.PrizeAmount / 100).toFixed(2),
          VoucherCount: res.Data.VoucherCount,
          count: that.data.checkedArr.length
        })
      },
      '',
      false);
  },
  //跳转课程详情
  courseDetail: function(e) {
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?Id=' + e.currentTarget.dataset.id + '&type=' + this.data.type + '&sheetId=' + this.data.sheetId + '&storeId=' + this.data.storeId + '&groupId=' + this.data.groupId + '&sourceFrom=2'
    })
  },
  //下拉刷新
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