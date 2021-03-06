var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const pay = require('../../services/pay.js');

var app = getApp();
Page({
  data: {
    status: 'fail',
    orderId: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log("params:", options)
    this.setData({
      orderId: options.orderId,
      status: options.status
    })
    console.log("status:", this.data.status)
  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  payOrder() {
    pay.payOrder(parseInt(this.data.orderId)).then(res => {
      this.setData({
        status: 'success'
      });
    }).catch(res => {
      util.showErrorToast('支付失败');
    });
  }
})