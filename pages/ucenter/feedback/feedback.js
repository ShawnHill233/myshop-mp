var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');



var app = getApp();

Page({
  data: {
    array: ['请选择反馈类型', '商品相关', '物流状况', '客户服务', '优惠活动', '功能异常', '产品建议', '其他'],
    index: 0,
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  onLoad: function (options) {
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },
  feedbackSubmit: function(e){
    console.log(this.data.array[this.data.index])
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let cate = this.data.array[this.data.index]
    let content = e.detail.value.content
    let mobile = e.detail.value.mobile
    util.request(api.ApiRootUrl + 'feedback', {cate: cate, content: content, mobile: mobile}, 'POST').then(function (res) {
      wx.navigateBack()
      wx.showToast({
        title: '谢谢你的建议',
        icon: 'success',
        duration: 2000
      });
    });
    
  }
})