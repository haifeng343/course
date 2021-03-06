var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
const app = getApp();
Page({

  data: {
    obj:{},
    windowHeight:'',
    windowWidth:'',
    content:{},
    dialog:false,
    posterUrl:'',
  },

  onLoad: function (options) {
    let that = this;
    that.setData({
      windowHeight: app.getGreen(0).windowHeight,
      windowWidth: app.getGreen(0).windowWidth,
    });

    that.getData();

    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }

    var recommand = wx.getStorageSync('userInfo').RecommandCode;//我的分享码
    shareApi.getShare("/pages/poster/poster", 0).then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj1: res.Data,
      })
    });

    shareApi.getShare("posterPage").then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      that.setData({
        obj2: res.Data,
      })
    })
  },

  init:function() {
    this.getData();
  },

  getData: function () {
    let that = this;
    var url = 'page/info';
    var params = {
      Type: 3,
    }
    netUtil.postRequest(url, params, function (res) {
      if (res.Data) {
        that.setData({
          content: JSON.parse(res.Data.Content)
        })
        wx.setNavigationBarTitle({
          title: that.data.content.pageTitle,
        })
        wx.getSystemInfo({
          success: function (res) {
            console.log(res)
            let temp = that.data.content;
            
            if (res.model == "iPhone X") {
              temp.ShowUrl = that.data.content.ShowUrlIphoneX;
              that.setData({
                totalTopHeight: 68,
                content:temp
              })
            }

            if (res.model == "iPhone 6") {
              temp.ShowUrl = that.data.content.ShowUrlIphone6
              that.setData({
                totalTopHeight: 20,
                content: temp
              })
            }
          },
        })
        console.log(that.data.content)
      }
    })
  },

  getPoster: function () {
    let that = this;
    var url = 'user/posters';
    var params = {}
    netUtil.postRequest(url, params, function (res) {
      that.setData({
        dialog: true,
        posterUrl: res.Data.ShowPostersUrl,
      })
    })
  },

  showDialog:function() {
    if (this.data.content.qrcodeChecked == true) {
      this.getPoster();
    } else {
      this.setData({
        dialog: true,
        posterUrl: this.data.content.ShowUrlPosters
      })
    }
  },

  posterCancel:function() {
    this.setData({
      dialog:false
    })
  },

  onSaveImg: function() {
    let that = this;
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.writePhotosAlbum']) {
          that.downloadFile();
          return;
        }

        wx.authorize({
          scope:'scope.writePhotosAlbum',
          success: function(res) {
            that.downloadFile();
          },
          fail: function(error) {
            that.retryAuth();
          }
        });
      }
    });
  },

  retryAuth: function() {
    let that = this;
    wx.showModal({
      content: '请授权相册权限，否则无法保存海报',
      confirmText: '去授权',
      success: function (res) {
        if (!res.confirm) {
          return;
        }

        wx.openSetting({
          success: function (res) {
            if (res.authSetting['scope.writePhotosAlbum']) {
              that.downloadFile();
            }
          },
          fail: function (error) {
            wx.showToast({
              icon: 'none',
              title: '授权失败',
            });
          }
        });
      }
    });
  },

  downloadFile: function() {
    let that = this;
    wx.showLoading({
      title: '下载中...'
    });

    console.log(that.data.posterUrl)
    wx.downloadFile({
      url: that.data.posterUrl,
      success: function(res) {
        wx.hideLoading();
        that.saveImgToPhoto(res.tempFilePath);
      },
      fail: function() {
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '下载海报失败',
        });
      }
    });
  },

  saveImgToPhoto: function(filePath) {
    let that = this;
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success: function(res) {
        wx.showModal({
          content: '已保存到系统相册',
          showCancel: false,
          confirmText: '确定',
          success: function() {
            that.posterCancel();
          },
        });
      },
      fail: function(error) {
        wx.showToast({
          title: '保存海报失败',
          icon: 'none'
        });
      }
    });
  },

  onShareAppMessage: function (res) {
    if (res.from == 'button') {
      return {
        title: this.data.obj2.Title,
        path: this.data.obj2.SharePath,
        desc: this.data.obj2.ShareDes,
        imageUrl: this.data.obj2.ShareImgUrl,
        success: (res) => {
          wx.showToast({
            icon: 'none',
            title: '分享成功',
          })
        }
      }
    }

    return {
      title: this.data.obj1.Title,
      path: this.data.obj1.SharePath,
      desc: this.data.obj1.ShareDes,
      imageUrl: this.data.obj1.ShareImgUrl,
      success: (res) => {
        wx.showToast({
          icon: 'none',
          title: '分享成功',
        })
      }
    }
  },
})