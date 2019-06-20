
Page({

 
  data: {
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
        number: '4',
        a:true,
      },
    ],
    color: '#ED8D6D',
    bgcolor: '#FCF4E7',
    checked:false,
  },
  //是否
  checkedTap: function () {
    var checked = this.data.checked;
    this.setData({
      "checked": !checked
    })
  },
  onShareAppMessage: function () {

  }
})