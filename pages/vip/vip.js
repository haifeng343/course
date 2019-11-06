Page({
  data: {
    price1: 300,
    price2: 400,
    vip: true,
    showId: 1,
    showName:'月卡',
    cardList: [{
        id: 1,
        name: '月卡',
        price: '100',
        oldPrice: '200',
      },
      {
        id: 2,
        name: '季卡',
        price: '300',
        oldPrice: '500'
      },
      {
        id: 3,
        name: '年卡',
        price: '600',
        oldPrice: '900'
      },
    ],
    vipList:[
      {
        id:1,
        status:1,
        name:'会员补贴金',
        icon:'../../images/bb1.png',
        text:"会员补贴金是会员才有的补贴金，其他是没有的，补贴金可以补贴上课的费用",
        decTitle:'详情名字0',
        dec:"这里是详情弹窗0",
        buttonName:"补贴详情"
      },
      {
        id:2,
        status:1,
        name:'推荐人',
        icon:'../../images/bb1.png',
        text: "会员补贴金是会员才有的补贴金，其他是没有的，补贴金可以补贴上课的费用",
        decTitle: '详情名字1',
        dec: "这里是详情弹窗1",
        buttonName: "奖励详情"
      },
      {
        id:2,
        status:1,
        name:'会员保障',
        icon:'../../images/bb1.png',
        text: "会员补贴金是会员才有的补贴金，其他是没有的，补贴金可以补贴上课的费用",
        decTitle: '详情名字2',
        dec: "这里是详情弹窗2",
        buttonName: "保障详情"
      },
      {
        id:3,
        status:1,
        name:'兑换电影票',
        icon:'../../images/bb1.png',
        text: "会员补贴金是会员才有的补贴金，其他是没有的，补贴金可以补贴上课的费用",
        decTitle: '详情名字3',
        dec: "这里是详情弹窗3",
        buttonName: "换购详情"
      },
    ]
  },
  onLoad: function(options) {

  },
  clickItem: function(e) {
    this.setData({
      showId: e.currentTarget.dataset.id,
      showName:e.currentTarget.dataset.name,
    });
  },
  showModal:function(e){
    console.log(e)
    wx.showModal({
      title: e.currentTarget.dataset.decname,
      content: e.currentTarget.dataset.dec,
      showCancel:false,
      confirmColor:"#000",
      confirmText:"知道了",
    })
  },
  bindFund: function() {
    wx.navigateTo({
      url: '/pages/fund/fund',
    })
  },
  bindRecharge: function() {
    wx.navigateTo({
      url: '/pages/rechargeLog/rechargeLog',
    })
  },
  onShareAppMessage: function() {

  }
})