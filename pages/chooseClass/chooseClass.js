
var netUtil = require("../../utils/request.js"); //require引入

Page({


  data: {
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
    TotalPrice: -1,
    imgUrls: [],
    autoplay: true, //是否自动播放
    indicatorDots: false, //指示点
    circular: true,
    interval: 5000, //图片切换间隔时间
    duration: 500, //每个图片滑动速度,
    current: 0, //初始化时第一个显示的图片 下标值（从0）index
  },
  onLoad(options) {
    let that = this;
    that.setData({
      Id: options.Id
    })
    that.getData();
  },
  getData: function() {
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
      }

      that.setData({
        detailCent: res.Data,
        imgUrls: res.Data.SheetImgList,
      })
      for (let a of r) {
        if (a.MinCount != 0) {
          a.text = "最多选" + a.MaxCount + '个，最少' + a.MinCount + '个'
        } else if (a.MaxCount >= a.ItemList.length) {
          a.text = "以下课程包含全部"
        } else {
          a.text = "以下课程" + a.ItemList.length + '选' + a.MaxCount
        }
      }
      that.setData({
        GroupList: r
      })
    }, function(msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
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
      ids: ids
    });
    var params = {
      SheetId: that.data.Id,
      RelId: ids
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调、
      that.setData({
        Remark: res.Data.Remark,
        TotalPrice: res.Data.TotalPrice == -1 ? -1 : res.Data.TotalPrice * 1.0 / 100,
      })
    }, function(msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  swiperChangeTo: function(e) {
    this.setData({
      current: e.detail.current,

    })
  },
  //是否
  checkedTap: function(e) {
    let index = e.currentTarget.dataset.index;
    let s = this.data.GroupList[index];
    let arr = e.detail.value;
    let arr2 = [];
    let a = 'GroupList[' + index + '].checkedArr';
    let c = 'GroupList[' + index + '].checked';
    let d = 'GroupList[' + index + '].ItemList';

    let arr3 = [];
    if (s.MaxCount >= s.ItemList.length && s.MinCount == 0) {
      let addCount = 0;
      if (s.checkedArr.length == 0) {
        for (let v of s.ItemList) {
          arr3.push(v.RelId);
          v.checked = true;
        }
      } else {
        for(let v of s.ItemList) {
          v.checked = false;
        }
        arr3 = [];
      }
      arr = arr3;
      this.setData({
        [c]: arr,
        [d]: s.ItemList
      });
    } else {
      if (s.MaxCount == 1 && arr.length > 0) {
        arr = [arr[arr.length - 1]]
      } else if (s.MaxCount > 1) {
        if (arr.length > s.MaxCount) {
          wx.showToast({
            title: '请正确勾选',
          })
          for (let v of s.ItemList) {
            if (v.RelId == arr[arr.length - 1]) {
              v.checked = false;
            }
          }
          
        }
      }
      this.setData({
        [c]: arr,
        [d]: s.ItemList
      });
    }
    this.setData({
      [a]: arr
    });
    this.hasMoney();
  },
  paybtn: function() {
    for (let v of this.data.GroupList) {
      if (v.checkedArr.length < v.MinCount || v.checkedArr.length > v.MaxCount) {
        wx.showToast({
          title: '请正确勾选',
        })
        return;
      }

    }
    wx.navigateTo({
      url: '/pages/payOrder/payOrder?Id=' + this.data.Id + '&ids=' + this.data.ids.join(','),
    })
  },
  courseDetail(e) {
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?Id=' + e.currentTarget.dataset.id,
    })
  },
  onShareAppMessage: function() {

  }
})