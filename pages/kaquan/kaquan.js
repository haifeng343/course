var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({

  data: {
    windowHeight: "",
    windowWidth: "",
    navbarActiveIndex: 0,
    navbarTitle: [
      "可使用",
      "已使用/已失效",
    ],
    modelList: [{
      list: [],
      status: 0, //是否需要刷新0是 1否
      pageIndex: 1,
      navbarActiveIndex: 0,
      isFinish: true,//数据是否加载完成
    }, {
      list: [],
      status: 0,
      pageIndex: 1,
      navbarActiveIndex: 1,
      isFinish:true,//数据是否加载完成
    }],
    usertoken:"",
    showId: 0, //默认选中
    showName: "", //默认选中
    showCode: false, //弹出券码
    ImgShow: '../../images/xia.png', //默认图片
    typeList: [], //分类列表
    List: [], //卡券列表
    pagecount: 10,
    page: 1,
    code: "", //券码
    codeImg: "", //二维码
    showDes: "", //显示的额外信息
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

    that.hasTypeList();
    that.init();
  },

  //获取我的卡券类型
  hasTypeList: function() {
    let that = this;
    var url = 'ticket/type/list';
    var params = {
      TypeId: that.data.showId,
      TypeName: that.data.showName,
    }
    netUtil.postRequest(url, params, function(res) {
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

  init: function() {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    shareApi.getShare("/pages/kaquan/kaquan", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, userInfo.RecommandCode)
      that.setData({
        obj: res.Data,
      })
    })

    that.setData({
      usertoken: userInfo.UserToken
    });

    if (userInfo.UserToken) {
      that.getData(1);
    }
  },

  getData: function(type) {
    let that = this;
    let tempModelList = that.data.modelList;

    //判断上一次操作是否完成,未完成直接返回
    if (tempModelList[that.data.navbarActiveIndex].isFinish != true) {
      return;
    }
    tempModelList[that.data.navbarActiveIndex].isFinish = false;
    that.setData({
      modelList: tempModelList
    });
    
    var url = 'ticket/list';
    var params = {
      TypeId: that.data.navbarActiveIndex == 0 ?that.data.showId:0,
      UseStatus: that.data.navbarActiveIndex==0?1:2,
      PageCount: 5,
      PageIndex: type == 1 ? 1 : (that.data.modelList[that.data.navbarActiveIndex].pageIndex + 1),
    }
    netUtil.postRequest(url, params, function(res) { 
      tempModelList = that.data.modelList;
      tempModelList[that.data.navbarActiveIndex].status = 1; //设置状态为已刷新
      let arr = res.Data; //返回数据
      //1.判断是刷新还是加载更多
      //a.如果刷新，设置页码数为1
      //b.如果加载更多且数据列表不为空，设置页码数+1
      if (type == 1) {
        tempModelList[that.data.navbarActiveIndex].list = arr;
        tempModelList[that.data.navbarActiveIndex].pageIndex = 1;
      } else {
        if (arr.length > 0) {
          tempModelList[that.data.navbarActiveIndex].list = tempModelList[that.data.navbarActiveIndex].list.concat(arr)
          tempModelList[that.data.navbarActiveIndex].pageIndex++;
        }
      } 
      tempModelList[that.data.navbarActiveIndex].isFinish = true;
      that.setData({
        modelList: tempModelList
      })
    }, function () {
      tempModelList[that.data.navbarActiveIndex].isFinish = true;
      that.setData({
        modelList: tempModelList
      });
    });
  },

  onNavBarTap: function (event) {
    // 获取点击的navbar的index
    let navbarTapIndex = event.currentTarget.dataset.navbarIndex
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    this.setData({
      navbarActiveIndex: navbarTapIndex
    })

    if (this.data.usertoken) {
      if (this.data.modelList[navbarTapIndex].status == 0) {
        this.getData(1);
      }
    }
  },

  navClick: function(e) {
    this.setData({
      showId: e.currentTarget.dataset.id,
      showName: e.currentTarget.dataset.name,
    })
    this.getData(1);
  },

  showTopPop: function() {
    this.setData({
      ImgShow: this.data.ImgShow == '../../images/xia.png' ? '../../images/up.png' : '../../images/xia.png'
    })
  },

  //点击额外信息
  showDesClick: function(e) {
    console.log(e)
    let that = this;
    let index = e.currentTarget.dataset.index;
    let tempArr = that.data.modelList;
    if (that.data.navbarActiveIndex == 0){
      tempArr[0].list[index].check = !tempArr[0].list[index].check
    }else{
      tempArr[1].list[index].check = !tempArr[1].list[index].check
    }
    console.log(tempArr)
    // tempArr[index].list.check = !tempArr[index].list.check;
    that.setData({
      modelList: tempArr
    });

  },

  //显示验券弹窗
  codeClick: function(e) {
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
  onReachBottom: function() {
    let that = this;
    that.getData(2);
  },

  //下拉刷新
  onPullDownRefresh: function() {
    let that = this;
    that.getData(1);
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