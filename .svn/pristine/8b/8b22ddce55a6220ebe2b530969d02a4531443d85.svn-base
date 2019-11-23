var netUtil = require("../../utils/request.js"); //require引入
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
    showDic: false,
    content: '',
    title: '',
    btnText: "知道了",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeDic: function() {
      this.setData({
        showDic: false
      })
    },
    init: function(title, rules) {
      let that = this;
      var url = 'banner/page/content';
      var params = {
        Code: rules,
      }
      netUtil.postRequest(url, params, function(res) {
        if (res.Data && res.Data.Content) {
          that.setData({
            title: title,
            content: res.Data.Content,
            showDic: true
          })
        } else {
          wx.showToast({
            title: '暂无说明',
            icon: "none"
          })
        }
      }, null, false);
    },
  }
})