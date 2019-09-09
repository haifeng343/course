var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
Page({

  data: {
    pagecount: 100,
    page: 1,
    List: [],
    money: 0, //总价
    totalCount: 0, //总数量
    totalChecked: false, //全选是否选中
    checkItem:[],
    load:false,
    usertoken:'',
  },
  onShow:function(){
    let isLoad = wx.getStorageSync('load');
    if (this.data.load == true || isLoad==true) {
      this.init();
    }
  },
  bindLogin: function () {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  onLoad: function(options) {
    console.log(11111)
    let that = this;
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare().then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,
        load:options.refresh || ''
      })
    })
    this.init();
  },
  init: function () {
    let usertoken = wx.getStorageSync('usertoken');
    console.log(usertoken)
    this.setData({
      usertoken: usertoken
    });
    if (usertoken) {
      this.getData();
    }
  },
  getData: function() {
    let that = this;
    var url = 'cart/list';
    var params = {
      PageCount: that.data.pagecount,
      PageIndex: that.data.page,
    }
    netUtil.postRequest(url, params, function(res) {
      res.Data.forEach(item => {
        item.Price = Number(item.Price / 100).toFixed(2)
      })
      let arr = that.data.List;
      let arr1 = res.Data;
      if (that.data.page == 1) {
        arr = arr1
      } else {
        arr = arr.concat(arr1)
      }
      that.setData({
        List: arr
      })
      if (that.data.page == 1) {
        that.setData({
          totalChecked: false,
          money: 0
        })
      } else {
        if (that.data.totalChecked == true) {
          that.allCheckedHandler();
        }
      }
      that.setData({
        load:false
      });
      wx.setStorageSync('load', false);
    },null,false,false,false)
  },
  navSheet:function(e){
    wx.navigateTo({
      url: '/pages/chooseClass/chooseClass?Id=' + e.currentTarget.dataset.id +'&type='+e.currentTarget.dataset.type,
    })
  },
  //删除购物车
  deleteCard: function(e) {
    let that = this;
    let item = e.currentTarget.dataset;
    let a = that.data.List[item.index]
    wx.showModal({
      content: '确定从购物车删除"' + (a.SheetModel == 1 ? a.SheetName : a.TradingareaName) + '"吗？',
      success: function(res) {
        if (res.confirm) {
          var url = 'cart/delete';
          var params = {
            Id: item.id,
          }
          netUtil.postRequest(url, params, function(res) {
            wx.showToast({
              icon: 'none',
              title: '成功删除',
            })
            let thisList = that.data.List;
            console.log(thisList)
            let money = 0;
            let totalCount = 0;
            let deleteIndex=0;//刪除數據下表
            thisList.forEach((f,index)=>{
              if (f.CartId == item.id){
                deleteIndex = index;
              }else{
                if (f.checked==true){
                  money = money + Number(f.Price);
                  totalCount = totalCount + 1;
                }
              }
            });
            thisList.splice(deleteIndex, 1);

            that.setData({
              List: thisList,
              money: money.toFixed(2),
              totalCount: totalCount
            });
            if (thisList.length<=0){
              that.setData({
                totalChecked: false,
              });
            }
          })
        }
      }
    })
  },
  goHome:function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //勾选
  checkedTap: function(e) {
    let that = this;
    let checkCartId = e.detail.value;
    that.setData({
      totalChecked: checkCartId.length >= that.data.List.length
    })
    //查找选中数据
    let money = 0;
    let totalCount = 0;
    let tempList = that.data.List;
    tempList.forEach(item=>{
      if (checkCartId.indexOf(item.CartId+'')!=-1){
        item.checked=true;
        money = money + Number(item.Price);
        totalCount = totalCount + 1;
      } else {
        item.checked = false;
      }
    });
    that.setData({
      List: tempList,
      money: money.toFixed(2),
      totalCount: totalCount
    });
  },
  //全选
  allChecked: function() {
    let that = this;
    that.setData({
      totalChecked: !that.data.totalChecked
    })
    that.allCheckedHandler();
  },
  //全选处理方法
  allCheckedHandler() {
    let that = this;
    let tempArr = that.data.List;
    let price = 0;
    let totalCount = 0;
    tempArr.forEach(e => {
      e.checked = that.data.totalChecked
      if (that.data.totalChecked == true) {
        price = price + Number(e.Price);
        totalCount = totalCount + 1;
      }
    })
    that.setData({
      List: tempArr,
      money: price.toFixed(2),
      totalCount: totalCount
    })
  },
  //结算购物车
  settlement:function() {
    let tempArr = this.data.List.filter(e=>{
      return e.checked == true
    })
    let checkedList=[];
    tempArr.forEach(item=>{
      checkedList.push({
        SheetId:item.SheetId,
        CartId: item.CartId == null ? 0 : item.CartId,
        RelId:item.ItemList.map(e=>{
          return e.RelId;
        })
      });
    });
    wx.navigateTo({
      url: '/pages/payOrder/payOrder?checkItem=' + JSON.stringify(checkedList),
    })
  },
  onPullDownRefresh: function() {
    this.setData({
      page: 1
    })
    this.init();
    wx.stopPullDownRefresh();
  },
  // onReachBottom: function() {
  //   let temp = this.data.page;
  //   temp++;
  //   this.setData({
  //     page: temp
  //   })
  //   this.init();
  // },
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