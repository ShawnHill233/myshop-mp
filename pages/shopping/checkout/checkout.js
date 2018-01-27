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
    checkoutType: '',

    orderNumber: '',
    variantId: 0,
    quantity: 0
  },
  onLoad: function (options) {
    let that = this;
    if(options.type == 'buyNow'){
      util.request(api.ApiRootUrl + 'checkout', { variant_id: options.variantId, quantity: options.quantity}, 'POST').then(function(res){
        console.log('item.........', res)
        that.setData({
          checkedGoodsList: [res.data.line_item],
          actualPrice: res.data.checked_amount,
          checkoutType: 'buyNow',
          variantId: Number(options.variantId),
          quantity: Number(options.quantity)
        });
      })
    }else{
      util.request(api.ApiRootUrl + 'carts').then(function (res) {
        console.log('carts...', res);
        that.setData({
          checkedGoodsList: res.data.line_items,
          actualPrice: res.data.checked_amount,
          // orderNumber: res.number
        });

        // that.setData({
        //   checkedAllStatus: that.isCheckedAll()
        // });
      });
    }
   
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
    let that = this
    util.request(api.ApiRootUrl + 'users/info').then(function (res) {
      console.log('user info', res)
      that.setData({
        name: res.data.name ? res.data.name : wx.getStorageSync('userInfo').nickName,
        mobile: res.data.mobile
      })
    })
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
    let that = this;
    if(!that.data.mobile){
      util.showErrorToast('请填写手机号');
      return false;
    }
    if(that.data.checkoutType == 'buyNow'){
      util.request(api.ApiRootUrl + 'orders/buy_now', { variant_id:that.data.variantId, quantity: that.data.quantity}, 'POST').then(function(res){
        const orderId = res.data.number;
        wx.redirectTo({
          url: '/pages/pay/pay?actualPrice=' + that.data.actualPrice + '&orderId=' + orderId
        });
      })
    }else{
      util.request(api.ApiRootUrl + 'orders', {}, 'POST').then(res => {
        console.log('created order...', res)
        // if (res.errno === 0) {
        const orderId = res.data.number;
        // pay.payOrder(parseInt(orderId)).then(res => {
        // wx.redirectTo({
        //   url: '/pages/payResult/payResult?status=1&orderId=' + orderId
        // });
        // }).catch(res => {
        wx.redirectTo({
          url: '/pages/pay/pay?actualPrice=' + that.data.actualPrice + '&orderId=' + orderId
        });
        // });
        // } else {
        //   util.showErrorToast('下单失败');
        // }
      });
    }
   
  }
})