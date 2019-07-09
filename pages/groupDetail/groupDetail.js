
var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    content: {},
    detailCent:{},
    ExtraList:[],
    imgUrls: [],
    text:'',//介绍
    autoplay: true, //是否自动播放
    indicatorDots: false, //指示点
    circular: true,
    interval: 5000, //图片切换间隔时间
    duration: 500, //每个图片滑动速度,
    current: 0, //初始化时第一个显示的图片 下标值（从0）index
    courseList: [
      {
        imgUrl: '../../images/t2.png',
        title: '英孚 (以下课程2选1)',
        addr: '西溪商圈',
        titleName: '英孚英语英语',
        yiPeople: '1235',
        guo: '32',
        distance: '1.0',
        time: '2019-09-30',
        tagList: [
          { tag: '老师认真辅助' },
          { tag: '老师认真辅助' },
          { tag: '老师认真辅助' },
          { tag: '老师认真辅助' },
          { tag: '老师认真辅助' },
          { tag: '老师认真辅助' },
          { tag: '老师认真辅助' },
          { tag: '老师认真辅助' },
          { tag: '老师认真辅助' },
        ],
        name: '英孚教育',
        address: '地址选择地址选择地址选择地址选择地址选择地址选择地址选择',
        nearby: '1.8',
        phone: '400-100-100',
        time: '60',
        number: '4'
      }, {
        imgUrl: '../../images/t2.png',
        title: '英孚 (以下课程2选1)',
        addr: '西溪商圈',
        titleName: '英孚英语英语',
        yiPeople: '1235',
        guo: '32',
        distance: '1.0',
        time: '2019-09-30',
        tagList: [
          { tag: '老师认真辅助' },
          { tag: '老师认真辅助' },
          { tag: '老师认真辅助' },
          { tag: '老师认真辅助' },
          { tag: '老师认真辅助' },
          { tag: '老师认真辅助' },
          { tag: '老师认真辅助' },
          { tag: '老师认真辅助' },
          { tag: '老师认真辅助' },
        ],
        name: '英孚教育',
        address: '地址选择地址选择地址选择地址选择地址选择地址选择地址选择',
        nearby: '1.8',
        phone: '400-100-100',
        time: '60',
        number: '4'
      },
    ],
    color: '#ED8D6D',
    bgcolor: '#FCF4E7',
  },

  onLoad: function (options) {
    var that = this;
    that.content = options
    var url = 'sheet/details';
    var params = {
      Longitude: that.content.Longitude,
      Latitude: that.content.Latitude,
      Id: that.content.Id
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调、
      var tempList = [];
      for (let index of res.Data.SheetImgList){
        index = index.replace(/\\/, "/");
        tempList.push(index);
      }
      let arr = [];
      that.setData({
        GroupList: res.Data.GroupList,
        detailCent : res.Data,
        ExtraList: res.Data.ExtraList,
        imgUrls: tempList
      })
      arr = res.Data.GroupList;
      for(let a of arr){
        if (a.MinCount!=0){
          that.setData({
            text:"最多选"+a.MaxCount+'个，最少'+a.MinCount+'个'
          })
        } else if (a.MaxCount >= a.ItemList.length){
          that.setData({
            text: "以下课程包含全部"
          })
        }else{
          that.setData({
            text: "以下课程" + a.ItemList.length + '选' + a.MaxCount
          })
        }
      }

      // var arr1 = [],arr2=[],arr3=[];
      // arr1 = res.Data.GroupList;
      // for(let a of arr1){
      //   let arr2 = a.ItemList;
      //   // console.log(arr2)
      //   for(let b of arr2){
      //     b.ItemCoverImg = b.ItemCoverImg.replace(/\\/,"/");
      //     arr3.push(b);
      //     console.log(arr2)
      //   }
      // }
      for (let index of res.Data.SheetImgList) {
        index = index.replace(/\\/, "/");
        tempList.push(index);
      }
    }, function (msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  swiperChange: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  chooseClass: function () {
    wx.navigateTo({
      url: '/pages/chooseClass/chooseClass',
    })
  },
  courseDetail(e) {
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?Id='+e.currentTarget.dataset.id,
    })
  },
  onShareAppMessage: function () {

  }
})