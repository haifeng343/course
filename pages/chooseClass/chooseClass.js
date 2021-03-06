var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");

const app = getApp();
Page({

  data: {
    windowHeight: '',
    windowWidth: '',
    Longitude: "",
    Latitude: "",
    GroupList: [],
    arr: [],
    color: '#ED8D6D',
    bgcolor: '#FCF4E7',
    detailCent: {},
    text: "",
    RelId: [],
    Remark: '',
    Id: '', //团单Id
    name: '',
    TotalPrice: -1,
    imgUrls: [],
    autoplay: true, //是否自动播放
    indicatorDots: false, //指示点
    circular: true,
    interval: 5000, //图片切换间隔时间
    duration: 500, //每个图片滑动速度,
    current: 0, //初始化时第一个显示的图片 下标值（从0）index
    type: '', //1团单 2商圈
    hideBaitiao: true, //弹窗是否隐藏
    dialogRadio: [], //单选 多选 弹窗列表
    dialogStoreName: '', //单选 多选 弹窗门店名称
    dialogStoreIndex: '', //单选 多选 弹窗门店index
    dialogGroupIndex: '', //单选 多选 弹窗分组index
    hideBaitiaos: true, //全部 弹窗
    totalDialog_storeList: [], // 全部弹窗 ，门店列表
    totalDialog_totalItem: 0, //全部弹窗 ，课程总数量
    totalDialog_storeId: 0, //全部弹窗 选中门店Id
    storeIdGotoTemp: 0, //临时定位到门店Id
    storeIdGoto: 0, //定位到门店Id
    PrizeAmount: '', //奖励金
    count: 0, //勾选课程数量
    VoucherCount: "",
    initGroupId: "", //初始化分组Id
    initStoreId: "", //初始化门店Id
    initRelId: "", //初始化课程关系id,
    sourceFrom: "" //跳转来源1.选课链条 2.分类
  },

  onLoad(options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
    });

    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }

    that.setData({
      Id: options.Id || '',
      name: options.name || '',
      type: options.type || '',
      storeIdGotoTemp: options.storeId || "",
      initGroupId: options.initGroupId || "",
      initStoreId: options.initStoreId || "",
      initRelId: options.initRelId || "",
      sourceFrom: options.sourceFrom || "",
    })

    if (options.type == 1) {
      wx.setNavigationBarTitle({
        title: '选择课程',
      })
    } else if (options.type == 2) {
      wx.setNavigationBarTitle({
        title: '选择体验课',
      })
    }

    that.init();
    that.selectComponent("#pop").getData("choose");
  },

  init: function() {
    let that = this;
    shareApi.getShare("/pages/chooseClass/chooseClass", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    })

    that.getData(true);
  },

  getData: function(isHideLoading) {
    var that = this;
    var url = 'sheet/details';
    var params = {
      Longitude: that.data.Longitude,
      Latitude: that.data.Latitude,
      Id: that.data.Id
    }
    
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调、
      let r = res.Data.GroupList;
      for (let v of r) {
        v.checkedArr = [];
        for (let a of v.StoreList) {
          if (a.ItemList[0].RemainCount > 0) {
            a.checked2 = 1;
          }
        }
      }

      if (that.data.sourceFrom != 1) { //课程详情跳过来的不更新基础数据
        that.setData({
          detailCent: res.Data,
          imgUrls: res.Data.SheetImgList,
        })

        for (let a of r) {
          if (a.MinCount != 0) {
            if (a.MaxCount >= a.TotalCount && a.MinCount == 1) {
              a.text = "任选"
            } else {
              a.text = "最少选" + a.MinCount + '门，最多选' + a.MaxCount + '门'
            }
          } else if (a.MaxCount == a.TotalCount) {
            a.text = "全选"
          } else {
            a.text = "必选" + a.MaxCount + '门，不可多选'
          }
        }

        that.setData({
          GroupList: r,
          count:0,
          TotalPrice:-1,
        })
      }

      that.setData({
        storeIdGoto: that.data.storeIdGotoTemp
      });

      if (that.data.initRelId) { //初始化存在课程Id，需要直接选中
        if (that.data.type == 2) { //商圈模式
          let groupListTemp = that.data.GroupList;
          groupListTemp.forEach((e, index) => { //匹配上分组
            if (e.GroupId == that.data.initGroupId) {
              let dialogGroupIndex = index; //点击的分组下标
              let storeList = e.StoreList; //点击的分组内门店列表
              let totalDialog_totalItem = e.TotalCount; //点击的分组内课程总数量
              storeList.forEach((x, xIndex) => {
                if (x.StoreId == that.data.initStoreId) { //匹配上门店
                  let storeName = x.StoreName; //点击的门店名称
                  let dialogStoreIndex = xIndex; //点击的门店下标
                  let totalDialog_storeId = x.StoreId; //点击的门店id
                  let storeItem = x.ItemList; //点击的门店下课程列表
                  that.changeCheck({ //模拟点击机构
                    type: 1,
                    currentTarget: {
                      dataset: {
                        storelist: storeList,
                        item: storeItem,
                        total: totalDialog_totalItem,
                        groupindex: dialogGroupIndex,
                        storeindex: dialogStoreIndex,
                        storeid: totalDialog_storeId,
                        name: storeName
                      }
                    }
                  });

                  if (that.data.hideBaitiaos == false) { //全部弹窗弹出
                    x.ItemList.forEach((y, yIndex) => {
                      if (y.RelId == that.data.initRelId) {
                        that.checkItem_total({
                          currentTarget: {
                            dataset: {
                              storeindex: dialogStoreIndex,
                              itemindex: yIndex
                            }
                          }
                        });
                      }
                    });
                  } else if (that.data.hideBaitiao == false) { //选择弹窗弹出
                    x.ItemList.forEach((y, yIndex) => {
                      if (y.RelId == that.data.initRelId) {
                        that.checkItem({
                          currentTarget: {
                            dataset: {
                              remaincount: y.RemainCount,
                              itemindex: yIndex
                            }
                          }
                        });
                      }
                    });
                  }
                }
              });
            }
          });
        }
      }
    }, null, isHideLoading, true, true); //调用get方法情就是户数
  },

  //计算团单项目选择购买价格
  hasMoney: function() {
    var that = this;
    var url = 'sheet/buy/price';
    let ids = [];
    for (let v of this.data.GroupList) {
      ids = ids.concat(v.checkedArr);
    }
    this.setData({
      ids: ids,
    });
    var params = {
      SheetId: that.data.Id,
      RelId: ids
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调、
        that.setData({
          Remark: res.Data.Remark,
          TotalPrice: res.Data.TotalPrice == -1 ? -1 : res.Data.TotalPrice * 1.0 / 100,
          PrizeAmount: (res.Data.PrizeAmount / 100).toFixed(2),
          VoucherCount: res.Data.VoucherCount,
          count: ids.length
        })
      },
      '',
      false);
  },
  swiperChangeTo: function(e) {
    this.setData({
      current: e.detail.current
    })
  },
  //是否
  checkedTap: function(e) {
    let success = true;
    let index = e.currentTarget.dataset.index;
    let s = this.data.GroupList[index];
    let arr = e.detail.value;
    let arr2 = [];
    let a = 'GroupList[' + index + '].checkedArr';
    let c = 'GroupList[' + index + '].checked';
    let d = 'GroupList[' + index + '].ItemList';
    let f = 'GroupList[' + index + '].StoreList';

    let arr3 = [];
    if (s.MaxCount >= s.TotalCount && s.MinCount == 0) { //全选
      let addCount = 0;
      if (s.checkedArr.length == 0) {
        if (this.data.type == 2) {
          // for (let v of s.StoreList) {
          //   arr3.push(v.StoreId);
          //   v.checked = true;
          // }
        } else {
          for (let v of s.ItemList) {
            arr3.push(v.RelId);
            v.checked = true;
          }
        }
      } else {
        if (this.data.type == 2) {
          // for (let v of s.StoreList) {
          //   v.checked = false;
          // }
        } else {
          for (let v of s.ItemList) {
            v.checked = false;
          }
        }
        arr3 = [];
      }
      arr = arr3;
      this.setData({
        [c]: arr,
        [d]: s.ItemList,
        [f]: s.StoreList || '',
      });
    } else {
      if (s.MaxCount == 1 && arr.length > 0) { //单选
        arr = [arr[arr.length - 1]];
        for (let v of s.ItemList) {
          if (arr.indexOf(v.RelId.toString()) != -1) {
            v.checked = v.RelId;
            s.checkedArr = [v.RelId];
          } else {
            v.checked = false;
          }
        }
      } else if (s.MaxCount == 1 && arr.length == 0) {
        for (let v of s.ItemList) {
          if (v.checked) {
            arr = [v.checked];
          }
        }
      } else if (s.MaxCount > 1) { //任选
        if (arr.length > s.MaxCount) {
          success = false;
          wx.showToast({
            icon: 'none',
            title: '请按 ' + s.GroupName + ' 规则选择课程',
          })
          if (this.data.type == 2) {
            // for (let v of s.StoreList) {
            //   if (v.StoreId == arr[arr.length - 1]) {
            //     v.checked = false;
            //   }
            // }
          } else {
            for (let v of s.ItemList) {
              if (v.RelId == arr[arr.length - 1]) {
                v.checked = false;
              }
            }
          }
        } else {
          if (this.data.type == 2) {
            // for (let v of s.StoreList) {
            //   if (arr.indexOf(v.StoreId.toString()) != -1) {
            //     v.checked = true;
            //   } else {
            //     v.checked = false;
            //   }
            // }
          } else {
            for (let v of s.ItemList) {
              if (arr.indexOf(v.RelId.toString()) != -1) {
                v.checked = false;
              } else {
                v.checked = v.RelId;
              }
            }
          }
        }
      }
      this.setData({
        [a]: arr,
        [c]: arr,
        [d]: s.ItemList,
        [f]: s.StoreList || '',
      });
    }
    this.setData({
      [a]: arr
    });
    if (success && this.data.type == 1) {
      this.hasMoney();
    }
  },

  //团单加入购物车
  addcar: function() {
    var that = this;
    var url = 'cart/add';
    let ids = [];
    for (let v of that.data.GroupList) {
      ids = ids.concat(v.checkedArr);
      if (v.checkedArr.length > 0 && (v.checkedArr.length < v.MinCount || v.checkedArr.length > v.MaxCount || (v.MinCount == 0 && v.MaxCount != v.checkedArr.length))) {
        wx.showToast({
          icon: 'none',
          title: '请正确勾选(' + v.GroupName + ')',
        })
        return;
      }
    }

    that.setData({
      ids: ids
    });

    var params = {
      SheetId: that.data.Id,
      RelId: ids
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调、
      that.getData(false);
      that.setData({
        TotalPrice: -1,
        count: 0,
      })

      wx.showToast({
        icon: 'none',
        title: '添加已成功'
      })
    });
  },

  checkItem: function(e) {
    let remaincount = e.currentTarget.dataset.remaincount; //剩余购买数量
    if (remaincount <= 0) {
      wx.showToast({
        icon: 'none',
        title: '体验课剩余名额不足',
      })
      return;
    }

    let itemindex = e.currentTarget.dataset.itemindex;
    let tempArr = this.data.dialogRadio;
    let checkedIndex = -1;
    tempArr.forEach((x, index) => {
      if (x.checked == true) {
        checkedIndex = index;
      }
      x.checked = false;
    });
    let source_storeItemSet = 'GroupList[' + this.data.dialogGroupIndex + '].StoreList[' + this.data.dialogStoreIndex + '].ItemList';

    if (checkedIndex != itemindex) {
      this.setData({
        dialogRadio: tempArr,
        [source_storeItemSet]: tempArr
      });
    }

    let storeCheckedSet = 'GroupList[' + this.data.dialogGroupIndex + '].StoreList[' + this.data.dialogStoreIndex + '].checked';
    let storeCheckedNameSet = 'GroupList[' + this.data.dialogGroupIndex + '].StoreList[' + this.data.dialogStoreIndex + '].checkedName';
    let source_itemCheckedSet = 'GroupList[' + this.data.dialogGroupIndex + '].StoreList[' + this.data.dialogStoreIndex + '].ItemList[' + itemindex + '].checked';
    // if (checkedIndex != itemindex) {
    //设置课程选中
    let itemCheckedSet = 'dialogRadio[' + itemindex + '].checked';
    this.setData({
      [itemCheckedSet]: true,
      [storeCheckedSet]: true,
      [storeCheckedNameSet]: this.data.GroupList[this.data.dialogGroupIndex].StoreList[this.data.dialogStoreIndex].ItemList[itemindex].ItemName,
      [source_itemCheckedSet]: true,
    });
    // } else {
    //   this.setData({
    //     [storeCheckedSet]: false,
    //     [storeCheckedNameSet]: "",
    //     [source_itemCheckedSet]: false,
    //   });
    // }

    let source_groupCheckedSet = 'GroupList[' + this.data.dialogGroupIndex + '].checkedArr';
    let checkedResult = [];
    this.data.GroupList[this.data.dialogGroupIndex].StoreList.forEach(y => {
      let tempCheckedArr = y.ItemList.filter(z => {
        return z.checked == true;
      })
      if (tempCheckedArr.length > 0) {
        checkedResult.push(tempCheckedArr[0].RelId);
      }
    })
    this.setData({
      hideBaitiao: true,
      [source_groupCheckedSet]: checkedResult
    })
    this.hasMoney();
  },
  checkItem_total: function(e) {
    let storeIndex = e.currentTarget.dataset.storeindex;
    let itemIndex = e.currentTarget.dataset.itemindex;
    let tempStoreList = this.data.totalDialog_storeList;
    //清空该门店下课程选中
    let checkedIndex = -1;
    tempStoreList[storeIndex].ItemList.forEach((item, index) => {
      if (item.checked == true) {
        checkedIndex = index;
      }
      item.checked = false;
    });

    if (itemIndex != checkedIndex) {
      this.setData({
        totalDialog_storeList: tempStoreList
      });
    }
    //取消选中
    // if (itemIndex == checkedIndex) {

    // } else {
    let itemCheckedSet = 'totalDialog_storeList[' + storeIndex + '].ItemList[' + itemIndex + '].checked';
    this.setData({
      [itemCheckedSet]: true
    });
    // }
  },
  //全部弹窗确定
  sureChecked: function() {
    let checkedResult = [];
    this.data.totalDialog_storeList.forEach((item, index) => {
      let tempCheckedArr = item.ItemList.filter(z => {
        return z.checked == true;
      })
      if (tempCheckedArr.length > 0) {
        let storeCheckedNameSet = 'GroupList[' + this.data.dialogGroupIndex + '].StoreList[' + index + '].checkedName';
        let itemCheckedSet = 'GroupList[' + this.data.dialogGroupIndex + '].StoreList[' + index + '].ItemList';
        checkedResult.push(tempCheckedArr[0].RelId);

        let itemCheckedList = this.data.GroupList[this.data.dialogGroupIndex].StoreList[index].ItemList;
        itemCheckedList.forEach(x => {
          if (x.RelId == tempCheckedArr[0].RelId) {
            x.checked = true;
          } else {
            x.checked = false;
          }
        });
        this.setData({
          [storeCheckedNameSet]: tempCheckedArr[0].ItemName,
          [itemCheckedSet]: itemCheckedList
        });
      }
    });
    if (checkedResult.length != this.data.totalDialog_totalItem) {
      wx.showToast({
        icon: 'none',
        title: '每家门店必须选择一门课程',
      })
      return;
    }
    let source_groupCheckedSet = 'GroupList[' + this.data.dialogGroupIndex + '].checkedArr';
    this.setData({
      [source_groupCheckedSet]: checkedResult
    })
    let storeCheckedSet = 'GroupList[' + this.data.dialogGroupIndex + '].StoreList'
    let storeListChecked = this.data.GroupList[this.data.dialogGroupIndex].StoreList;
    storeListChecked.forEach(x => {
      x.checked = true;
    });
    this.setData({
      [storeCheckedSet]: storeListChecked,
      hideBaitiaos: true,
    })
    this.hasMoney();
  },
  cancelChecked: function() {

  },
  paybtn: function() {
    for (let v of this.data.GroupList) {
      if (v.checkedArr.length > 0 && (v.checkedArr.length < v.MinCount || v.checkedArr.length > v.MaxCount || (v.MinCount == 0 && v.MaxCount != v.checkedArr.length))) {
        wx.showToast({
          icon: 'none',
          title: '请正确勾选(' + v.GroupName + ')',
        })
        return;
      }

    }

    let checkedList = [];
    checkedList.push({
      SheetId: this.data.Id,
      RelId: this.data.ids
    });

    wx.navigateTo({
      url: '/pages/payOrder/payOrder?checkItem=' + JSON.stringify(checkedList) + '&type=' + this.data.type,
    })
  },

  courseDetail(e) {
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?Id=' + e.currentTarget.dataset.id + '&type=' + this.data.type + '&sheetId=' + this.data.Id,
    })
  },

  onPullDownRefresh: function() {
    this.getData(true);
    this.setData({
      TotalPrice: -1
    })
    
    wx.stopPullDownRefresh()
  },

  //取消/选中
  changeCheck: function(e) {
    let that = this;
    let storeList = e.currentTarget.dataset.storelist; //点击的分组内门店列表
    let storeItem = e.currentTarget.dataset.item; //点击的门店下课程列表
    let totalDialog_totalItem = e.currentTarget.dataset.total; //点击的分组内课程总数量
    let dialogGroupIndex = e.currentTarget.dataset.groupindex; //点击的分组下标
    let dialogStoreIndex = e.currentTarget.dataset.storeindex; //点击的门店下标
    let totalDialog_storeId = e.currentTarget.dataset.storeid; //点击的门店id
    let storeName = e.currentTarget.dataset.name; //点击的门店名称

    that.setData({
      dialogStoreIndex: dialogStoreIndex,
      dialogGroupIndex: dialogGroupIndex,
      totalDialog_totalItem: totalDialog_totalItem
    })
    if (that.data.GroupList[dialogGroupIndex].MaxCount == that.data.GroupList[dialogGroupIndex].TotalCount && that.data.GroupList[dialogGroupIndex].MinCount == 0) {
      if (that.data.GroupList[dialogGroupIndex].StoreList[dialogStoreIndex].checked == true) { //取消选中
        if (e.type == 1) {
          return;
        }
        let storeCheckedSet = 'GroupList[' + dialogGroupIndex + '].StoreList'
        let storeListChecked = that.data.GroupList[dialogGroupIndex].StoreList;
        storeListChecked.forEach(x => {
          x.checked = false;
          x.ItemList.forEach(y => {
            y.checked = false;
          })
        });
        that.setData({
          [storeCheckedSet]: storeListChecked
        })

        let source_groupCheckedSet = 'GroupList[' + dialogGroupIndex + '].checkedArr';
        let checkedResult = [];
        that.data.GroupList[dialogGroupIndex].StoreList.forEach(y => {
          let tempCheckedArr = y.ItemList.filter(z => {
            return z.checked == true;
          })
          if (tempCheckedArr.length > 0) {
            checkedResult.push(tempCheckedArr[0].RelId);
          }
        })
        console.log(checkedResult)
        that.setData({
          [source_groupCheckedSet]: checkedResult
        })
        that.hasMoney();
      } else {
        //判断是否只有一门
        let isOnlyOne = true;
        let error = 0;
        //是否每组只有一个
        let tempArr = storeList.filter(item => {
          return item.ItemList.length > 1;
        });
        if (tempArr.length > 0) {
          isOnlyOne = false;
        }

        if (isOnlyOne == true) {
          storeList.forEach(e => {
            if (e.ItemList[0].RemainCount <= 0) {
              wx.showToast({
                icon: 'none',
                title: '至少一家门店体验课剩余名额不足',
              })
              error = 1;
              return;
            }
            e.ItemList[0].checked = true;
          })
          if (error == 1) {
            return;
          }
          that.setData({
            totalDialog_storeList: storeList
          });
          that.sureChecked();
        } else {
          that.setData({
            hideBaitiaos: false,
            totalDialog_storeId: totalDialog_storeId,
            totalDialog_storeList: storeList
          })
        }
      }
    } else {
      let storeCheckedSet = 'GroupList[' + dialogGroupIndex + '].StoreList[' + dialogStoreIndex + '].checked';
      let storeCheckedNameSet = 'GroupList[' + dialogGroupIndex + '].StoreList[' + dialogStoreIndex + '].checkedName';
      if (that.data.GroupList[dialogGroupIndex].StoreList[dialogStoreIndex].checked == true) { //取消选中
        if (e.type == 1) {
          return;
        }
        let storeItemListSet = 'GroupList[' + dialogGroupIndex + '].StoreList[' + dialogStoreIndex + '].ItemList';
        let tempArr = that.data.GroupList[dialogGroupIndex].StoreList[dialogStoreIndex].ItemList;
        tempArr.forEach(x => {
          x.checked = false;
        });
        that.setData({
          [storeCheckedSet]: false,
          storeCheckedNameSet: "",
          [storeItemListSet]: tempArr
        });

        let source_groupCheckedSet = 'GroupList[' + dialogGroupIndex + '].checkedArr';
        let checkedResult = [];
        that.data.GroupList[dialogGroupIndex].StoreList.forEach(y => {
          let tempCheckedArr = y.ItemList.filter(z => {
            return z.checked == true;
          })
          if (tempCheckedArr.length > 0) {
            checkedResult.push(tempCheckedArr[0].RelId);
          }
        })
        that.setData({
          [source_groupCheckedSet]: checkedResult
        })
        that.hasMoney();
      } else {
        if (storeItem.length == 1) {
          if (storeItem[0].RemainCount <= 0) {
            wx.showToast({
              icon: 'none',
              title: '该体验课剩余名额不足',
            })
            return;
          } else {
            let storeCheckedSet = 'GroupList[' + dialogGroupIndex + '].StoreList[' + dialogStoreIndex + '].checked';
            let storeCheckedNameSet = 'GroupList[' + dialogGroupIndex + '].StoreList[' + dialogStoreIndex + '].checkedName';
            let source_itemCheckedSet = 'GroupList[' + dialogGroupIndex + '].StoreList[' + dialogStoreIndex + '].ItemList[0].checked';
            this.setData({
              [storeCheckedSet]: true,
              [storeCheckedNameSet]: this.data.GroupList[dialogGroupIndex].StoreList[dialogStoreIndex].ItemList[0].ItemName,
              [source_itemCheckedSet]: true,
            });
            let source_groupCheckedSet = 'GroupList[' + dialogGroupIndex + '].checkedArr';
            let checkedResult = [];
            this.data.GroupList[dialogGroupIndex].StoreList.forEach(y => {
              let tempCheckedArr = y.ItemList.filter(z => {
                return z.checked == true;
              })
              if (tempCheckedArr.length > 0) {
                checkedResult.push(tempCheckedArr[0].RelId);
              }
            })
            this.setData({
              hideBaitiao: true,
              [source_groupCheckedSet]: checkedResult
            })
            this.hasMoney();
          }
        } else {
          that.setData({
            hideBaitiao: false,
            dialogRadio: storeItem,
            dialogStoreName: storeName,
            dialogStoreIndex: dialogStoreIndex,
            dialogGroupIndex: dialogGroupIndex,
          })
        }
      }
    }
  },

  navtoCar: function() {
    wx.setStorageSync('load', true);
    wx.navigateTo({
      url: '/pages/car/car?type=' + this.data.type,
    });
  },
  showDialog(e) {
    let dialogGroupIndex = e.currentTarget.dataset.groupindex;
    let dialogStoreIndex = e.currentTarget.dataset.storeindex;
    //如果是全部分组
    if (this.data.GroupList[dialogGroupIndex].MaxCount == this.data.GroupList[dialogGroupIndex].TotalCount && this.data.GroupList[dialogGroupIndex].MinCount == 0) {
      this.setData({
        hideBaitiaos: false,
        totalDialog_storeList: e.currentTarget.dataset.storelist,
        totalDialog_totalItem: e.currentTarget.dataset.total,
        dialogStoreIndex: dialogStoreIndex,
        dialogGroupIndex: dialogGroupIndex,
        totalDialog_storeId: e.currentTarget.dataset.storeid
      })
    } else {
      this.setData({
        hideBaitiao: false,
        dialogRadio: e.currentTarget.dataset.item,
        dialogStoreName: e.currentTarget.dataset.name,
        dialogStoreIndex: dialogStoreIndex,
        dialogGroupIndex: dialogGroupIndex,
      })
    }
  },
  dialogHide: function(e) {
    this.setData({
      hideBaitiao: true,
    })
  },
  dialogHides: function(e) {
    this.setData({
      hideBaitiaos: true,
    })
  },
  cancelChecked: function() {
    this.setData({
      hideBaitiaos: true
    })
  },
  mechanismDetail: function(e) {
    wx.navigateTo({
      url: '/pages/mechanism/mechanism?groupId=' + e.currentTarget.dataset.groupid + '&storeId=' + e.currentTarget.dataset.storeid + '&type=' + this.data.type + '&sheetId=' + this.data.Id
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