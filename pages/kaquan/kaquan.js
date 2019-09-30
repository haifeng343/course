var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({

  data: {
    windowHeight: "",
    windowWidth: "",
    des: 1, //隐藏
    showId:0,//默认选中
    showName:"",//默认选中
    showTop: false, //隐藏分类
    showCode: false, //弹出券码
    ImgShow: '../../images/xia.png', //默认图片
    typeList:[],//分类列表
    List:[],//卡券列表
    pagecount:10,
    page:1,
    code:"",//券码
    codeImg:"",//二维码
    showDes:"",//显示的额外信息
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
    shareApi.getShare("/pages/kaquan/kaquan", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,

      })
    })
    that.hasTypeList();
    that._getCardList();
  },
  init:function() {},
   //获取我的卡券类型
  hasTypeList: function () {
    let that = this;
    var url = 'ticket/type/list';
    var params = {
      TypeId: that.data.showId,
      TypeName: that.data.showName,
    }
    netUtil.postRequest(url, params, function (res) {
      let arr = res.Data;
      arr.unshift({
        TypeId: 0,
        TypeName: '全部'
      });
      that.setData({
        typeList: arr,
      })
    },
      null,
      false,
      false,
      false)
  },
  //获取我的卡券列表
  _getCardList: function() {
    let that = this;
    var url = 'ticket/list';
    var params = {
      TypeId: that.data.showId,
      UseStatus: 1,
      PageCount: that.data.pagecount,
      PageIndex: that.data.page,
    }
    netUtil.postRequest(url, params, function (res) {
      let arr = res.Data;
      var arr1 = that.data.List;
      if (that.data.page == 1) {
        arr1 = arr;
      } else {
        arr1 = arr1.concat(res.Data);
      }
      that.setData({
        List: arr1
      })
    });
  },
  navClick: function(e) {
    this.setData({
      showId: e.currentTarget.dataset.id,
      showName: e.currentTarget.dataset.name,
      showTop:false,
      ImgShow: '../../images/xia.png'
    })
    console.log(e.currentTarget.dataset)
    this._getCardList();
  },
  showTopPop: function() {
    this.setData({
      showTop: !this.data.showTop,
      ImgShow: this.data.ImgShow == '../../images/xia.png' ? '../../images/up.png' : '../../images/xia.png'
    })
  },
  //点击额外信息
  showDesClick:function(e){
    let index = e.currentTarget.dataset.index;
    let tempArr=this.data.List;
    tempArr[index].check = !tempArr[index].check;
    this.setData({
      List: tempArr
    });

  },
  //显示验券弹窗
  codeClick: function(e) {
    console.log(e)
    this.setData({
      code: e.currentTarget.dataset.code,
      codeImg: e.currentTarget.dataset.codeimg,
      showCode: true,
    })
  },
  dialogHide: function() {
    this.setData({
      showCode: false
    })
  },
  InvalidClick: function() {
    wx.navigateTo({
      url: '/pages/invalid/invalid',
    })
  },
  //上拉加载更多
  onReachBottom: function () {
    let that = this;
    var temp_page = this.data.page;
    temp_page++;
    this.setData({
      page: temp_page
    });
    that._getCardList();

  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      page: 1
    });
    this._getCardList();
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