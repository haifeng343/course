var netUtil = require("../../utils/request.js"); //require引入
var shareApi = require("../../utils/share.js");
let baseUrl = "https://test.guditech.com/rocketclient/";
Page({
  data: {
    array: ['拍错/不想拍', '不喜欢', '与实物不符合', '重新再拍'],
    index: 0,
    objectArray: ['拍错/不想拍', '不喜欢', '与实物不符合', '重新再拍'],
    index: 0,
    imgs: [],
    text: '',
    plusShow: true,
    courseId: 1,
    userId: 1,
    userRole: 4,
    orderId: '', //Id
    kmd: '', //状态码
    kd: '',
    Reason: '拍错/不想拍',
    lpm: {},
    urlImgs: [],
  },
  onLoad: function(options) {
    if (options.recommand) {
      wx.setStorageSync("recommand", options.recommand)
    }
    var recommand = wx.getStorageSync('userInfo').RecommandCode;
    shareApi.getShare().then(res => {
      res.Data.SharePath = res.Data.SharePath.replace(/@recommand/g, recommand)
      this.setData({
        obj: res.Data,

      })
    })
    this.setData({
      orderId: options.OrderId,
      kmd: options.kmd || '',
      kd: options.kd || '',
    });
    this.init();
  },
  init: function () {
    this.has();
  },
  getData: function() {
    let that = this;
    var url = 'order/refund/apply';
    var params = {
      OrderId: that.data.orderId,
      Reason: that.data.Reason,
      ImgList: that.data.urlImgs,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      console.log(res.Data.RefundStatus)
      var refundStatus = res.Data.RefundStatus;
      that.setData({
        List: res.Data
      })
      let pages = getCurrentPages(); //当前页面
      let prevPage = pages[pages.length - 2]; //上一页面
      let prePage1 = pages[pages.length - 3]; //上上一页
      // console.log(prePage1.data.modelList);return;
      if (that.data.kmd == 1) {
        let tempList = prevPage.data.modelList;
        tempList.forEach(x => {
          x.list.forEach(item => {
            if (that.data.orderId == item.OrderId) {
              item.UseStatus = refundStatus;
            }
          })
        })
        prevPage.setData({ //直接给上移页面赋值
          modelList: tempList,
        });

      } else if (that.data.kmd == 2) {
        let temp = prevPage.data.detail;
        temp.UseStatus = refundStatus;
        prevPage.setData({ //直接给上移页面赋值
          detail: temp,
        });

        if (that.data.kd == 3){
          let temp = [];
          temp = prePage1.data.modelList;
          temp.forEach(x => {
            x.list.forEach(item => {
              if (that.data.orderId == item.OrderId) {
                item.UseStatus = refundStatus;
              }
            })
          })
          prePage1.setData({ //直接给上移页面赋值
            modelList: temp,
          });
        }
      }
      wx.showModal({
        title: '您已成功申请退款',
        showCancel:false,
        success: function () {
          wx.navigateBack({
            delta: 1
          });
        }
      })
    }); //调用get方法情就是户数
  },
  chooseImg: function(e) {
    var that = this;
    var imgs = that.data.imgs; //存图片地址的变量
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // console.log(res)
        imgs.push(tempFilePaths[0]);
        that.upLoadImg(tempFilePaths[0]);
        that.setData({
          imgs: imgs
        });
        that.showHide();
      }
    });
  },
  /*
      删除图片
  */
  deleteImg: function(e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      imgs: imgs
    });
    this.showHide();
  },
  /*
      预览图片
  */
  previewImg: function(e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },
  /*
      控制添加图片按钮是否显示出来
  */
  showHide: function(e) {
    if (this.data.imgs.length == 1) {
      this.setData({
        plusShow: true
      });
    } else if (this.data.imgs.length < 6) {
      this.setData({
        plusShow: true
      });
    } else if (this.data.imgs.length == 6) {
      this.setData({
        plusShow: false
      });
    }
  },
  has: function() {
    let that = this;
    var url = 'order/details';
    var params = {
      Id: that.data.orderId,
      Status: 1,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      // console.log(res)
      that.setData({
        lpm: res.Data
      })
    });
  },
  /*提交*/
  submit: function() {
    this.getData();
  },
  //上传图片
  upLoadImg: function(data) {
    var that = this;
    let usertoken = wx.getStorageSync('usertoken');
    wx.uploadFile({
      url: baseUrl + 'img/upload',
      filePath: data,
      header: {
        "Content-Type": "multipart/form-data", //记得设置
        'channelCode': 'wechat',
        'appVersion': '1.0.1',
        "userToken": usertoken,
      },
      name: 'Order.Refund',
      success: (res) => {
        var ttt = JSON.parse(res.data)
        var temp = that.data.urlImgs;
        temp.push(ttt.Data.ImgPath);
        that.setData({
          urlImgs: temp
        })
      },
      fail: (res) => {
        wx.showToast({
          icon: 'none',
          title: res.data.ErrorMessage,
        })
      },
    });
  },
  bindPickerChange: function(e) {
    let index = e.detail.value;
    // console.log('picker发送选择改变，携带值为', this.data.array[index])
    this.setData({
      index: e.detail.value,
      Reason: this.data.array[index]
    })
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