var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    orderList: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

    this.getOrderList();
  },
  getOrderList() {
    let that = this;
    util.request(api.ApiRootUrl + 'orders').then(function (res) {
      console.log(res);
      that.setData({
        orderList: res.data.orders
      });
    });
  },
  payOrder(e) {
    console.log("form data....",e.target)
    let orderId = e.target.dataset.orderId
    let actualPrice = e.target.dataset.paymentTotal
    wx.redirectTo({
      url: '/pages/pay/pay?actualPrice=' + actualPrice + '&orderId=' + orderId,
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})