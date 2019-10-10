// components/pop.js
var netUtil = require("../../utils/request.js"); //require引入
var setTime;
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    popList: [],
    token:"",
    statusBarHeight:"",
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getData: function(token) {
      let that = this;
      var url = 'user/pop/list';
      var params = {
        GroupToken: token,
      }
      netUtil.postRequest(url, params, function(res) {
          let temp = res.Data;
          let xpl = wx.getSystemInfoSync();
          that.setData({
            token: token,
            statusBarHeight: xpl.statusBarHeight
          })
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
    //启动弹窗关闭定时器
    closeInterval: function(closeTime, index) {
      let that = this;
      if (setTime != null) {
        clearTimeout(setTime);
      }
      if (closeTime <= 0) {
        return;
      }
      setTime = setTimeout(function() {
        let temp = that.data.popList;
        temp[index]['pop'] = false;
        if (temp.length > index + 1) {
          temp[index + 1]['pop'] = true
          closeTime = temp[index + 1].CloseTime;
          index = index + 1;
        } else {
          clearTimeout(setTime);
          closeTime = -1;
          index = index + 1;
        }
        that.setData({
          popList: temp
        })
        that.closeInterval(closeTime, index);
      }, closeTime);
    },
    popclick: function(e) {
      // this.triggerEvent('popclick', e.currentTarget.dataset);
      let that = this;
      let actiontype = e.currentTarget.dataset.actiontype;
      let actionparams = e.currentTarget.dataset.actionparams;
      let executeparams = e.currentTarget.dataset.executeparams;
      let index = e.currentTarget.dataset.index;
      let popId = e.currentTarget.dataset.popid;
      if (executeparams == 'receiveTasks') {
        that.receiveTasks(popId, function() {
          if (actiontype == 0) {
            return;
          }
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
        if (actiontype == 0) {
          return;
        }
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
    shutDown: function(e) {
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
    //弹窗本地支持代码
    //1.领取任务
    receiveTasks: function(popId, onSuccess) {
      let that = this;
      var url = 'user/pop/task/receive';
      var params = {
        PopId: popId,
      }
      netUtil.postRequest(url, params, function(res) {
          wx.showToast({
            icon: 'none',
            title: '领取成功，请进入【钱包】提现。',
          })
          onSuccess();
        },
        null,
        false,
        true,
        true)
    },
  }
})