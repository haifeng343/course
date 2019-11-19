var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({

  data: {
    windowHeight: '',
    windowWidth: '',
    pagetype: '', //页面name
    loading:true,
  },

  onLoad: function(options) {
    let that = this;
    let recommand="";
    let fromPageType="";
    if (options.scene) {
      console.log(options.scene)
      let temp = unescape(options.scene);
      let arr = temp.split("$");
      arr.forEach(item=>{
        let itemTemp=item.split(':');
        if(itemTemp[0] =='recommand'){
          recommand=itemTemp[1];
        }
        if (itemTemp[0].toLowerCase() == 'fpt'){
          fromPageType = itemTemp[1];
        }
      })
    }else{
      recommand = options.recommand;
      fromPageType = options.fpt;
    }
    if (recommand){
      wx.setStorageSync("recommand", recommand );
    }
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
      pagetype: fromPageType,
    });
    that.init();
  },

  init: function() {
    let that = this;
    shareApi.getShare("/pages/mid/mid", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, wx.getStorageSync('userInfo').RecommandCode)
      that.setData({
        obj: res.Data,
      })
    });

    that.getData();
  },

  getData: function() {
    let that = this;
    var url = 'user/skip';
    var params = {
      PageType: that.data.pagetype
    };
    netUtil.postRequest(url, params, function(res) {
      console.log(res)
      if(!res.Data){
        that.setData({
          loading:false
        })
      }else{
        let JumpPath = res.Data.JumpPath;
        let JumpType = res.Data.JumpType;
        if (JumpPath.substr(0, 1) === '/') {

        } else {
          JumpPath = '/' + JumpPath;
        }

        let jumpUrl = (JumpType == 1 ? JumpPath : 'pages/WebView/WebView?path=' + JumpPath);
        if (JumpPath == "/pages/index/index" || JumpPath == "/pages/order/order" || JumpPath == "/pages/mine/mine") {
          wx.switchTab({
            url: jumpUrl,
          })
        } else {
          wx.redirectTo({
            url: jumpUrl
          });
        }
      }
    }, null, true, false, true);
  },

  next: function() {
    this.getData();
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