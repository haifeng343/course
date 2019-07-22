const app = getApp();
App({
  // 头部导航栏的高度
  onLaunch: function() {
    var that = this;
    //自定义title设置顶部
    wx.getSystemInfo({
      success: function(res) {
        that.globalData.platform = res.platform
        let totalTopHeight = 68
        if (res.model.indexOf('iPhone X') !== -1) {
          totalTopHeight = 88
        } else if (res.model.indexOf('iPhone') !== -1) {
          totalTopHeight = 64
        }
        that.globalData.statusBarHeight = res.statusBarHeight
        that.globalData.titleBarHeight = totalTopHeight - res.statusBarHeight
      },
      failure() {
        that.globalData.statusBarHeight = 0
        that.globalData.titleBarHeight = 0
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // console.log(res)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          // wx.navigateTo({
          //   url: '/pages/authorization/authorization',
          // })
        }
      },
    })
  },
  onLoad() {
    wx.loadFontFace({ //微信小程序平方字体

      family: 'PingFangSC-Medium',

      source: 'url("https://www.your-server.com/PingFangSC-Medium.ttf")',

      success: function() {
        console.log('load font success')
      }

    })
  },
  share: function(title, path, imageUrl) {
    //设置一个默认分享背景图片
    let defaultImageUrl = '//upload.jianshu.io/admin_banners/web_images/4613/e96eece16a9e3ae1699dd4bd0002666c571c30f5.jpeg?imageMogr2/auto-orient/strip|imageView2/1/w/1250/h/540';
    this.globalData.userInfo && this.globalData.userInfo.IsReferral && (path += "&ReferralUserId=" + this.globalData.userInfo.UserId)
    return {
      title: title || '加入VIP，能省会赚，最高返40%！',
      path: path,
      imageUrl: imageUrl || defaultImageUrl,
      // success(res) {
      //     console.log("转发成功！");
      //     if (!res.shareTickets) {
      //         //分享到个人
      //         api.shareFriend().then(() => {
      //             console.warn("shareFriendSuccess!");
      //             //执行转发成功以后的回调函数
      //             callback && callback();
      //         });
      //     } else {
      //         //分享到群
      //         let st = res.shareTickets[0];
      //         wx.getShareInfo({
      //             shareTicket: st,
      //             success(res) {
      //                 let iv = res.iv
      //                 let encryptedData = res.encryptedData;
      //                 api.groupShare(encryptedData, iv).then(() => {
      //                     console.warn("groupShareSuccess!");
      //                     //执行转发成功以后的回调函数
      //                     callback && callback();
      //                 });
      //             }
      //         });
      //     }
      // },
      // fail: function(res) {
      //     console.log("转发失败！");
      // }
    };
  },
  globalData: {
    userInfo: null
  },

})