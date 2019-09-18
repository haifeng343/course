var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
var setTime;
Page({

  data: {
    pagecount: 100,
    page: 1,
    List: [],
    money: 0, //总价
    totalCount: 0, //总数量
    totalChecked: false, //全选是否选中
    checkItem: [],
    load: true,
    thisPageRefresh:true,
    usertoken: '',
    type:"",//1团单 2 商圈
    PrizeAmount:"",//总奖励金
    VoucherCount:"",//总代金券
    checkArr:[],
  },
  onShow: function() {
    this.init();
  },
  bindLogin: function() {
    wx.redirectTo({
      url: '/pages/login/login',
    })
  },
  onLoad: function(options) {
    console.log(options)
    let that = this;
    that.setData({
      load: options.refresh || '',
      type: options.type || '',
    })
    if(options.type==1){
      wx.setNavigationBarTitle({
        title: '购物车',
      })
    }
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare().then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj: res.Data,
      })
    })
    this._popList();
  },
  //启动弹窗关闭定时器
  closeInterval: function (closeTime, index) {
    let that = this;
    if (setTime != null) {
      clearInterval(setTime);
    }
    if (closeTime <= 0) {
      return;
    }
    setTime = setInterval(function () {
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
  _popList: function () {
    let that = this;
    var url = 'user/pop/list';
    var params = {
      GroupToken: 'car',
    }
    netUtil.postRequest(url, params, function (res) {
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
  popclick: function (e) {
    let that = this;
    console.log(e);
    let actiontype = e.currentTarget.dataset.actiontype;
    let actionparams = e.currentTarget.dataset.actionparams;
    let executeparams = e.currentTarget.dataset.executeparams;
    let index = e.currentTarget.dataset.index;
    let popId = e.currentTarget.dataset.popid;
    if (executeparams == 'receiveTasks') {
      that.receiveTasks(popId, function () {
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
  shutDown: function (e) {
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
    let usertoken = wx.getStorageSync('usertoken');
    this.setData({
      usertoken: usertoken,
    });
    if (usertoken) {
      let isRefreshFromPage = wx.getStorageSync('load');
      if (this.data.thisPageRefresh || this.data.load || isRefreshFromPage == true) {
        this.getData();
      }
    }
  },
  getData: function() {
    let that = this;
    var url = 'cart/list';
    var params = {
      PageCount: that.data.pagecount,
      PageIndex: that.data.page,
      SheetModel : that.data.type
    }
    console.log(params)
    netUtil.postRequest(url, params, function(res) {
      res.Data.forEach(item => {
        item.Price = Number(item.Price / 100).toFixed(2);
        item.PrizeAmount = Number(item.PrizeAmount / 100).toFixed(2);
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
        load: false,
        thisPageRefresh:false
      });
      wx.setStorageSync('load', false);
    }, null, true, false, false)
  },
  navSheet: function(e) {
    wx.navigateTo({
      url: '/pages/chooseClass/chooseClass?Id=' + e.currentTarget.dataset.id + '&type=' + e.currentTarget.dataset.type,
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
            let deleteIndex = 0; //刪除數據下表
            thisList.forEach((f, index) => {
              if (f.CartId == item.id) {
                deleteIndex = index;
              } else {
                if (f.checked == true) {
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
            if (thisList.length <= 0) {
              that.setData({
                totalChecked: false,
              });
            }
          })
        }
      }
    })
  },
  goHome: function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //勾选
  checkedTap: function(e) {
    console.log(e)
    let that = this;
    let checkCartId = e.detail.value;
    that.setData({
      totalChecked: checkCartId.length >= that.data.List.length,
      checkArr: checkCartId
    })
    //查找选中数据
    let money = 0;
    let PrizeAmount = 0;
    let totalCount = 0;
    let VoucherCount = 0;
    let tempList = that.data.List;
    tempList.forEach(item => {
      if (checkCartId.indexOf(item.CartId + '') != -1) {
        item.checked = true;
        money = money + Number(item.Price);
        PrizeAmount = PrizeAmount + Number(item.PrizeAmount);
        VoucherCount = VoucherCount + Number(item.VoucherCount)
        totalCount = totalCount + 1;
      } else {
        item.checked = false;
      }
    });
    that.setData({
      List: tempList,
      money: money.toFixed(2),
      totalCount: totalCount,
      VoucherCount: VoucherCount,
      PrizeAmount: PrizeAmount.toFixed(2),
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
    let VoucherCount = 0;
    let PrizeAmount = 0;
    tempArr.forEach(e => {
      e.checked = that.data.totalChecked
      if (that.data.totalChecked == true) {
        price = price + Number(e.Price);
        totalCount = totalCount + 1;
        PrizeAmount = PrizeAmount + Number(e.PrizeAmount);
        VoucherCount = VoucherCount + Number(e.VoucherCount);
      }
    })
    
    that.setData({
      List: tempArr,
      money: price.toFixed(2),
      totalCount: totalCount,
      PrizeAmount: PrizeAmount.toFixed(2),
      VoucherCount: VoucherCount,
      checkArr: (that.data.totalChecked == true ? tempArr : []),
    })
  },
  //结算购物车
  settlement: function() {
    let tempArr = this.data.List.filter(e => {
      return e.checked == true
    })
    let checkedList = [];
    tempArr.forEach(item => {
      checkedList.push({
        SheetId: item.SheetId,
        CartId: item.CartId == null ? 0 : item.CartId,
        RelId: item.ItemList.map(e => {
          return e.RelId;
        })
      });
    });
    wx.navigateTo({
      url: '/pages/payOrder/payOrder?checkItem=' + JSON.stringify(checkedList)+'&type='+this.data.type,
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