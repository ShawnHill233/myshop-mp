var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    order: {},
    orderId: 0,
    orderInfo: {},
    orderGoods: [],
    handleOption: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id
    });
    this.getOrderDetail();
  },
  getOrderDetail() {
    let that = this;
    util.request(api.ApiRootUrl + 'orders/' + that.data.orderId).then(function (res) {
        console.log(res.data);
        that.setData({
          order: res.data,
          orderGoods: res.data.line_items,
          // handleOption: res.data.handleOption
        });
        //that.payTimer();
    });
  },
  payTimer() {
    let that = this;
    let orderInfo = that.data.orderInfo;

    setInterval(() => {
      console.log(orderInfo);
      orderInfo.add_time -= 1;
      that.setData({
        orderInfo: orderInfo,
      });
    }, 1000);
  },
  payOrder() {
    wx.redirectTo({
      url: '/pages/pay/pay?actualPrice=' + this.data.order.total + '&orderId=' + this.data.orderId,
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
  },
  cancelOrder: function(){
    let that = this;
    util.request(api.ApiRootUrl + 'orders/' + that.data.orderId + '/cancel', {}, 'POST').then(function (res) {
      console.log(res.data);
      that.setData({
        order: res.data,
      });
    });
  }
})