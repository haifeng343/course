import { shareApi} from '../../utils/share.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Id:''
  },
  onLoad(options){
    this.setData({
      Id:options.Id || ''
    })
    shareApi().then(res => {
      this.setData({
        obj: res.Data,

      })
    })
  },
  onShareAppMessage: function(res) {
    console.log(res)
    if(res.form=='button'){
      console.log(res.target,res)
    }
   
    return {
      title: this.data.obj.ShareTitle,
      path: '/pages/share/share?recommand='+this.data.Id,
      desc: "描述",
      imageUrl: this.data.obj.ShareUrlShow,
      success: (res) => {
        wx.showToast({
          icon:'none',
          title: '分享成功',
        })
      }
    }
  },
})