var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var user = require('../../services/user.js');

Page({
  data: {
    orderId: 0,
    actualPrice: 0.00,
    payWay: 'wx',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.orderId,
      actualPrice: options.actualPrice
    })
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
  //向服务请求支付参数
  requestPayParam() {
    let that = this;
    util.request(api.ApiRootUrl + 'orders/' + this.data.orderId + '/mp_pay_params').then(function (res) {
        let payParam = res.data.pay_params;
        console.log("payParm:", payParam)
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            wx.redirectTo({
              url: '/pages/payResult/payResult?status=success',
            })
          },
          'fail': function (res) {
            wx.redirectTo({
              url: '/pages/payResult/payResult?status=fail&orderId=' + that.data.orderId,
            })
          }
        })
    });
  },
  payLater() {
    let that = this;
    util.request(api.ApiRootUrl + 'orders/' + this.data.orderId + '/delay_pay', {}, 'POST').then(function (res) {
        wx.redirectTo({
          url: '/pages/payResult/payResult?status=delay',
        })
    });
  },
  startPay() {
    let payWay = this.data.payWay;
    if (payWay == 'delay'){
      this.payLater();
    }else if(payWay == 'wx'){
      this.requestPayParam();
    }
  },

  checkedItem: function (event) {
    let that = this
    let checked_payWay = event.target.dataset.itemValue;
    
    if (checked_payWay == 'wx'){
      that.setData({
        payWay: 'wx',
      })
    } else if (checked_payWay == 'delay'){
      that.setData({
        payWay: 'delay',
      })
    }
  }
})