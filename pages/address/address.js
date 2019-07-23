var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
Page({

  data: {
    hasAddress: true,
    items: [],
    startX: 0, //开始坐标
    startY: 0,
    pl: '',
  },
  edit: function(e) {
    // console.log(e)
    let item = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/editAddress/editAddress?address=' + item.address + '&title=' + item.title + '&lat=' + item.lat + '&lng=' + item.lng + '&tag=' + item.tag + '&addressId=' + item.addressid + '&doornumber=' + item.doornumber,
    })
  },
  addAddress: function() {
    wx.navigateTo({
      url: '/pages/editAddress/editAddress?ids=' + 1,
    })
  },
  onShow() {
    this.getData();
  },
  getData: function() {
    let that = this;

    var url = 'user/address/list';
    var params = {

    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      console.log(res);
      that.setData({
        items: res.Data
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
  onLoad: function(e) {
    if (e.recommand) {
      wx.setStorageSync("recommand", e.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare().then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      this.setData({
        obj: res.Data,

      })
    })
      var that = this;

      for (var i = 0; i < 10; i++) {

        this.data.items.push({

          content: i + " 向左滑动删除哦,向左滑动删除哦,向左滑动删除哦,向左滑动删除哦,向左滑动删除哦",

          isTouchMove: false //默认隐藏删除

        })

      }

      this.setData({

        items: this.data.items

      });

    }

    ,

  //手指触摸动作开始 记录起点X坐标

  touchstart: function(e) {

    //开始触摸时 重置所有删除

    this.data.items.forEach(function(v, i) {

      if (v.isTouchMove) //只操作为true的

        v.isTouchMove = false;

    })

    this.setData({

      startX: e.changedTouches[0].clientX,

      startY: e.changedTouches[0].clientY,

      items: this.data.items

    })

  },

  //滑动事件处理

  touchmove: function(e) {

    var that = this,

      index = e.currentTarget.dataset.index, //当前索引

      startX = that.data.startX, //开始X坐标

      startY = that.data.startY, //开始Y坐标

      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标

      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标

      //获取滑动角度

      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });

    that.data.items.forEach(function(v, i) {

      v.isTouchMove = false

      //滑动超过30度角 return

      if (Math.abs(angle) > 30) return;

      if (i == index) {

        if (touchMoveX > startX) //右滑

          v.isTouchMove = false

        else //左滑

          v.isTouchMove = true

      }

    })

    //更新数据

    that.setData({

      items: that.data.items

    })

  },

  /**
  
  * 计算滑动角度
  
  * @param {Object} start 起点坐标
  
  * @param {Object} end 终点坐标
  
  */

  angle: function(start, end) {

    var _X = end.X - start.X,

      _Y = end.Y - start.Y

    //返回角度 /Math.atan()返回数字的反正切值

    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);

  },

  //删除事件

  del: function(e) {
    console.log(e)
    let that = this;

    var url = 'user/address/delete';
    var params = {
      Id: e.currentTarget.dataset.id
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      wx.showModal({
        title: '提示',
        content: '确定要删除吗？',
        success: function(sm) {
          if (sm.confirm) {
            wx.showToast({
              icon: "none",
              title: '删除成功',
            });
            setTimeout(() => {
              that.getData();
            }, 500)
          } else if (sm.cancel) {
            console.log('用户点击取消')
          }
        }
      });

    }, function(msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
    // this.data.items.splice(e.currentTarget.dataset.index, 1)
    // this.setData({

    //   items: this.data.items

    // })

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