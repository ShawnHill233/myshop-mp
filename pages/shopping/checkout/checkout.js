var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();

Page({
  data: {
    name: '',
    mobile: '',
    checkedGoodsList: [],
    checkedAddress: {},
    checkedCoupon: [],
    couponList: [],
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00,    //快递费
    couponPrice: 0.00,     //优惠券的价格
    orderTotalPrice: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
    addressId: 0,
    couponId: 0,

    orderNumber: ''
  },
  onLoad: function (options) {
    let that = this;
    util.request(api.ApiRootUrl + 'carts').then(function (res) {
      console.log('carts...', res);
      that.setData({
        checkedGoodsList: res.line_items,
        actualPrice: res.checked_amount,
        // orderNumber: res.number
      });

      // that.setData({
      //   checkedAllStatus: that.isCheckedAll()
      // });
    });
   
    util.request(api.ApiRootUrl + 'users/info').then(function(res){
      that.setData({
        name: res.name.length > 0 ? res.name : wx.getStorageSync('userInfo').nickName,
        mobile: res.mobile
      })
    })

  },
  getCheckoutInfo: function () {
    wx.hideLoading();
  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/shopping/address/address',
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/shopping/addressAdd/addressAdd',
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    wx.showLoading({
      title: '加载中...',
    })
    this.getCheckoutInfo();

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  submitOrder: function () {
    // if (this.data.addressId <= 0) {
    //   util.showErrorToast('请选择收货地址');
    //   return false;
    // }
    if(this.data.mobile.length == 0){
      util.showErrorToast('请填写手机号');
      return false;
    }
    util.request(api.ApiRootUrl + 'orders', {}, 'POST').then(res => {
      console.log('created order...', res)
      // if (res.errno === 0) {
        const orderId = res.number;
        // pay.payOrder(parseInt(orderId)).then(res => {
          // wx.redirectTo({
          //   url: '/pages/payResult/payResult?status=1&orderId=' + orderId
          // });
        // }).catch(res => {
          wx.redirectTo({
            url: '/pages/pay/pay?actualPrice=' + this.data.actualPrice + '&orderId=' + orderId
          });
        // });
      // } else {
      //   util.showErrorToast('下单失败');
      // }
    });
  }
})