var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();

Page({
  data: {
    windowHeight: '',
    windowWidth: '',
    pagecount: 200,
    page: 1,
    List: [],
    totalChecked: false, //全选是否选中
    usertoken: '',
    isInitialized: false,
    type: "", //1团单 2 商圈
    totalCheckedLength: 0, //总选择数量
    totalPrizeAmount: 0, //总奖励金额
    totalVoucherCount: 0, //总奖励卡券数量
    totalPayPrice: 0, //总价格
  },

  bindLogin: function() {
    wx.redirectTo({
      url: '/pages/login/login',
    })
  },

  onLoad: function(options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
    });

    that.setData({
      type: options.type || '',
    })

    if (options.type == 1) {
      wx.setNavigationBarTitle({
        title: '购物车',
      })
    }

    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }

    that.selectComponent("#pop").getData("car");
    that.init();
  },

  //初始化
  init: function() {
    let that = this;
    shareApi.getShare("/pages/car/car", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    })
  },

  onShow: function() {
    let that = this;
    that.setData({
      usertoken: wx.getStorageSync('usertoken'),
    });

    that.getData(false);
  },

  getData:function(isRefreshData) {
    if (this.data.usertoken && (isRefreshData || !this.data.isInitialized || wx.getStorageSync('load') == true)) {
      this._getData();
    }
  },

  //获取列表
  _getData: function() {
    let that = this;
    var url = 'cart/list';
    var params = {
      PageCount: that.data.pagecount,
      PageIndex: that.data.page,
      SheetModel: that.data.type
    }

    netUtil.postRequest(url, params, function(res) {
      let tempArr = res.Data;
      tempArr.forEach(item => {
        item.checkArr = [];
        item.CheckLength = 0;
        item.TotalPrice = 0;
      });

      that.setData({
        isInitialized: true,
        List: tempArr,
      })

      wx.setStorageSync('load', false);
    }, null, true, true, true)
  },

  //删除购物车(课程)
  deleteCard_item: function(item) {
    let that = this;
    that._delete(item.id, 2, function() {
      wx.showToast({
        icon: 'none',
        title: '成功删除',
      })
      let sheetId = item.sheetid;
      let sheetIndex = item.sheetindex;
      let itemIndex = item.itemindex;

      let thisList = that.data.List;
      thisList[sheetIndex].ItemList.splice(itemIndex, 1);
      that.setData({
        List: thisList
      });

      let tempArr = [];
      tempArr = thisList[sheetIndex].ItemList.filter(x => {
        return x.checked == true;
      }).map(x => {
        return x.Id + '';
      });
      that.ItemChange({
        currentTarget: {
          dataset: {
            sheetid: sheetId,
            sheetindex: sheetIndex
          }
        },
        detail: {
          value: tempArr
        }
      }, function() {
        if (thisList[sheetIndex].ItemList.length <= 0) {
          thisList.splice(sheetIndex, 1);
        }
        that.setData({
          List: thisList
        });
      });
    });
  },

  //删除购物车(团单)
  deleteCard_sheet: function(e) {
    let sheetIndex = e.currentTarget.dataset.sheetindex;
    let sheetItem = e.currentTarget.dataset.sheetitem;
    let that = this;
    wx.showModal({
      content: '确定删除"' + (sheetItem.SheetModel == 1 ? sheetItem.SheetName : sheetItem.TradingareaName) + '"吗？',
      success: function(res) {
        if (res.confirm) {
          that._delete(sheetItem.CartId, 1, function() {
            wx.showToast({
              icon: 'none',
              title: '成功删除',
            })
            let thisList = that.data.List;

            thisList.splice(sheetIndex, 1);
            that.setData({
              List: thisList
            });
            //判断是否全选
            let allCheckedList = thisList.filter(item => {
              return item.checked != true;
            });
            let totalCheckedLength = 0;
            let totalPrizeAmount = 0;
            let totalVoucherCount = 0;
            let totalPayPrice = 0;
            thisList.forEach(item => {
              totalCheckedLength += item.checkArr.length;
              totalPrizeAmount += item.PrizeAmount;
              totalVoucherCount += item.VoucherCount;
              totalPayPrice += (item.TotalPrice <= 0 ? 0 : item.TotalPrice);
            });
            that.setData({
              totalChecked: allCheckedList.length > 0 ? false : true,
              totalCheckedLength: totalCheckedLength,
              totalPrizeAmount: (totalPrizeAmount * 1.0 / 100).toFixed(2),
              totalVoucherCount: totalVoucherCount,
              totalPayPrice: (totalPayPrice * 1.0 / 100).toFixed(2)
            });
          });
        }
      }
    })
  },

  //删除
  _delete: function(id, type, onsuccess) {
    var url = 'cart/delete';
    var params = {
      Id: id,
      Type: type,
    }
    netUtil.postRequest(url, params, function(res) {
      if (onsuccess) {
        onsuccess();
      }
    })
  },

  //团单勾选（只做课程全选逻辑）
  checkedTap: function(e) {
    let sheetid = e.currentTarget.dataset.sheetid; //点击的团单id
    let sheetindex = e.currentTarget.dataset.sheetindex; //点击的团单下标
    let totalChecked = e.totalChecked; //是否全选（1全选 2全不选 3不改变）
    let that = this;
    let tempList = that.data.List;

    //勾选/未勾选
    if (totalChecked) {
      tempList[sheetindex].checked = totalChecked == 1 ? true : totalChecked == 2 ? false : tempList[sheetindex].checked;
    } else {
      tempList[sheetindex].checked = !tempList[sheetindex].checked;
    }
    let checked = tempList[sheetindex].checked;

    let tempArr = [];
    if (checked == true) {
      tempArr = tempList[sheetindex].ItemList.map(x => {
        return x.Id + '';
      });
    }

    this.ItemChange({
      currentTarget: {
        dataset: {
          sheetid: sheetid,
          sheetindex: sheetindex
        }
      },
      detail: {
        value: tempArr
      }
    });
  },

  //课程勾选
  ItemChange(e, onSuccess) {
    let sheetId = e.currentTarget.dataset.sheetid; //点击的团单Id
    let sheetIndex = e.currentTarget.dataset.sheetindex; //点击的团单下标
    let itemCheckedList = e.detail.value; //团单下勾选的课程
    let that = this;

    let tempList = that.data.List;
    console.log(tempList)
    tempList[sheetIndex].checkArr = [];
    let i = 0;
    tempList[sheetIndex].ItemList.forEach(item => {
      //如果勾选包含Id，加入勾选
      if (itemCheckedList.indexOf(item.Id + '') != -1) {
        tempList[sheetIndex].checkArr.push({
          Id: item.Id,
          RelId: item.RelId
        });
        item.checked = true;
      } else {
        i++;
        item.checked = false;
      }
    });

    if (i == 0) {
      tempList[sheetIndex].checked = true;
    } else {
      tempList[sheetIndex].checked = false;
    }
    //判断是否全选
    let allCheckedList = tempList.filter(item => {
      return item.checked != true;
    });

    tempList[sheetIndex].CheckLength = tempList[sheetIndex].checkArr.length;
    that._sheetPrice(sheetId, tempList[sheetIndex].checkArr.map(x => {
      return x.RelId;
    }), function(res) {
      tempList[sheetIndex].PrizeAmount = res.Data.PrizeAmount;
      tempList[sheetIndex].VoucherCount = res.Data.VoucherCount;
      tempList[sheetIndex].TotalPrice = res.Data.TotalPrice;
      let totalCheckedLength = 0;
      let totalPrizeAmount = 0;
      let totalVoucherCount = 0;
      let totalPayPrice = 0;
      tempList.forEach(item => {
        totalCheckedLength += item.checkArr.length;
        totalPrizeAmount += item.PrizeAmount;
        totalVoucherCount += item.VoucherCount;
        totalPayPrice += (item.TotalPrice <= 0 ? 0 : item.TotalPrice);
      });

      console.log(totalPayPrice)
      that.setData({
        List: tempList,
        totalChecked: allCheckedList.length > 0 ? false : true,
        totalCheckedLength: totalCheckedLength,
        totalPrizeAmount: (totalPrizeAmount * 1.0 / 100).toFixed(2),
        totalVoucherCount: totalVoucherCount,
        totalPayPrice: (totalPayPrice * 1.0 / 100).toFixed(2)
      });
      console.log(that.data.totalPayPrice)
      if (onSuccess) {
        onSuccess();
      }
    });
  },

  //全选
  allChecked: function() {
    let that = this;
    that.setData({
      totalChecked: !that.data.totalChecked
    })
    let tempList = that.data.List;
    tempList.forEach((item, index) => {
      that.checkedTap({
        currentTarget: {
          dataset: {
            sheetid: item.SheetId,
            sheetindex: index
          }
        },
        totalChecked: that.data.totalChecked
      });
    });
  },

  //结算购物车
  settlement: function() {
    let tempArr = this.data.List.filter(e => {
      return (e.checkArr != null && e.checkArr.length > 0);
    })
    let checkedList = [];
    tempArr.forEach(item => {
      checkedList.push({
        SheetId: item.SheetId,
        CartId: item.CartId == null ? 0 : item.CartId,
        RelId: item.checkArr.map(e => {
          return e.RelId;
        })
      });
    });
    wx.navigateTo({
      url: '/pages/payOrder/payOrder?checkItem=' + JSON.stringify(checkedList) + '&type=' + this.data.type,
    })
  },

  //长按出现操作栏(删除购物车【课程】)
  longTap: function(e) {
    let that = this;
    let item = e.currentTarget.dataset;
    wx.showActionSheet({
      itemList: ['删除'],
      success: function(e) {
        if (e.tapIndex == 0) {
          that.deleteCard_item(item);
        }
      }
    })
  },

  onPullDownRefresh: function() {
    this.setData({
      page: 1
    })

    this.getData(true);
    wx.stopPullDownRefresh();
  },

  _sheetPrice: function(sheet, relId, onSuccess) {
    let that = this;
    var url = 'sheet/buy/price';
    var params = {
      SheetId: sheet,
      RelId: relId,
    }
    netUtil.postRequest(url, params, function(res) {
      onSuccess(res);
    }, null, false, true, true, 0)
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