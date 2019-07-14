var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    date: '', //不填写默认今天日期，填写后是默认日期
    dataStart: '', //有效日期
    dataEnd: '', //
    showError: false,
    pagecount:20,
    page:1,
    year:'',
    month:'',
    array:[],
  },
  onShow: function() {
    var date = new Date();
    let arr =[],arr1=[];
    this.setData({
      year: date.getFullYear(),
      month: date.getMonth() + 1
    })
    
    var year = date.getFullYear();
    arr.push('全部');
    for (var i = year; i >1970;i--){
      arr.push(i+'年')
    }
    arr1 = ['全部','1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    this.setData({
      array:[arr,arr1],
      now: this.data.month+'月'
    })
    this.getData();
  },
  onLoad:function() {
  },
  getData: function() {
    let that = this;
    var url = 'user/cash/record/list';
    var params = {
      Year: that.data.year,
      Month: that.data.month,
      PageCount:that.data.pagecount,
      PageIndex:that.data.page
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      // console.log(res)
      that.setData({
        List: res.Data
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
  bindDateChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    let index = e.detail.value;
    if (index[0]==0 && index[1]==0){
      this.setData({
        date:'全部'
      })
    }else{
      this.setData({
        date: this.data.array[0][index[0]] + ',' + this.data.array[1][index[1]],
        year: this.data.array[0][index[0]],
        month: this.data.array[1][index[1]]
      })
    }
    this.getData();
  },
  showEor: function() {
    this.setData({
      showError: true
    })
  },
  closed: function() {
    this.setData({
      showError: false
    })
  },
  withdrawDetail: function() {
    wx.navigateTo({
      url: '/pages/withdrawDetail/withdrawDetail',
    })
  },
  onShareAppMessage: function() {

  }
})