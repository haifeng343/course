var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");

Page({

  data: {
    showSuccess:false,
    name:'',
    content:"",
    vipList: [{
        id: 1,
        status: 1,
        name: '会员补贴金',
        icon: '../../images/bb1.png',
        text: "会员补贴金是会员才有的补贴金，其他是没有的，补贴金可以补贴上课的费用",
        decTitle: '详情名字0',
        dec: "这里是详情弹窗0",
        buttonName: "立即使用"
      },
      {
        id: 2,
        status: 2,
        name: '推荐人',
        icon: '../../images/bb1.png',
        text: "会员补贴金是会员才有的补贴金，其他是没有的，补贴金可以补贴上课的费用",
        decTitle: '详情名字1',
        dec: "这里是详情弹窗1",
        buttonName: "专属海报"
      },
      {
        id: 2,
        status: 3,
        name: '会员保障',
        icon: '../../images/bb1.png',
        text: "会员补贴金是会员才有的补贴金，其他是没有的，补贴金可以补贴上课的费用",
        decTitle: '详情名字2',
        dec: "这里是详情弹窗2",
        buttonName: "保障详情"
      },
      {
        id: 3,
        status: 4,
        name: '兑换电影票',
        icon: '../../images/bb1.png',
        text: "会员补贴金是会员才有的补贴金，其他是没有的，补贴金可以补贴上课的费用",
        decTitle: '详情名字3',
        dec: "这里是详情弹窗3",
        buttonName: "换购详情"
      },
    ],
  },

  onLoad: function(options) {
    this.init();
  },

  init: function() {
    let that = this;
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare("/pages/myBenefits/myBenefits", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,
      })
    });

    that.getData();
  },

  // 获取会员权益信息
  getData: function() {
    let that = this;
    var url = 'member/equity/list';
    let userInfo = wx.getStorageSync('userInfo');
    var params = {
      GradeId: userInfo.MemberId,
    }
    netUtil.postRequest(url, params, function(res) {
      if (res.Data) {
        that.setData({
          vipList: res.Data
        })
      }
    })
  },

  gotoPoster: function() {
    wx.navigateTo({
      url: '/pages/poster/poster',
    })
  },

  gotoKaquan: function() {
    wx.navigateTo({
      url: '/pages/kaquan/kaquan?type=1',
    })
  },

  gotoSubsidy: function() {
    wx.navigateTo({
      url: '/pages/subsidy/subsidy',
    })
  },

  baozhangDialog:function(e) {
    this.setData({
      name: e.currentTarget.dataset.title,
      content: e.currentTarget.dataset.content,
      showSuccess: true
    })
  },

  closeded:function() {
    this.setData({
      showSuccess:false
    })
  },

  onShareAppMessage: function (res) {
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