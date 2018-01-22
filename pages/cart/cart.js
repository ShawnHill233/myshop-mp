var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp();

Page({
  data: {
    cart: {},
    cartGoods: [],
    cartTotal: {
      "goodsCount": 0,
      "goodsAmount": 0.00,
      "checkedGoodsCount": 0,
      "checkedGoodsAmount": 0.00
    },
    isEditCart: false,
    checkedAllStatus: true,
    editCartList: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数


  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    this.getCartList();
    this.setData({
      isEditCart: false
    })
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  getCartList: function () {
    let that = this;
    util.request(api.ApiRootUrl + 'carts').then(function (res) {
      console.log('carts...', res);
      that.setData({
        cartGoods: res.data.line_items,
        cart: res.data,
        'cartTotal.checkedGoodsCount': res.data.checked_count
      });

      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });
  },
  isCheckedAll: function () {
    //判断购物车商品已全选
    return this.data.cartGoods.every(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });
  },
  checkedItem: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let that = this;

    if (!this.data.isEditCart) {
      util.request(api.ApiRootUrl + 'carts/check', { line_item_id: that.data.cartGoods[itemIndex].id, checked: that.data.cartGoods[itemIndex].checked ? 0 : 1 }, 'POST').then(function (res) {
          console.log(res.data);
          that.setData({
            cartGoods: res.data.line_items,
            cart: res.data,
          });

        that.setData({
          checkedAllStatus: that.isCheckedAll(),
          'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
        });
      });
    } else {
      //编辑状态
      let tmpCartData = this.data.cartGoods.map(function (element, index, array) {
        if (index == itemIndex) {
          element.checked = !element.checked;
        }

        return element;
      });

      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }
  },
  getCheckedGoodsCount: function () {
    let checkedGoodsCount = 0;
    this.data.cartGoods.forEach(function (v) {
      if (v.checked === true) {
        checkedGoodsCount += v.quantity;
      }
    });
    console.log(checkedGoodsCount);
    return checkedGoodsCount;
  },
  checkedAll: function () {
    let that = this;

    if (!this.data.isEditCart) {
      var productIds = this.data.cartGoods.map(function (v) {
        return v.id;
      });
      util.request(api.ApiRootUrl + 'carts/check_all', { checked: that.isCheckedAll() ? 0 : 1 }, 'POST').then(function (res) {
          console.log(res.data);
          that.setData({
            cartGoods: res.data.line_items,
            cart: res.data,
            'cartTotal.checkedGoodsCount': res.data.checked_count
          });

        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });
      });
    } else {
      //编辑状态
      let checkedAllStatus = that.isCheckedAll();
      let tmpCartData = this.data.cartGoods.map(function (v) {
        v.checked = !checkedAllStatus;
        return v;
      });

      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }

  },
  editCart: function () {
    var that = this;
    if (this.data.isEditCart) {
      this.getCartList();
      this.setData({
        isEditCart: !this.data.isEditCart
      });
    } else {
      //编辑状态
      let tmpCartList = this.data.cartGoods.map(function (v) {
        v.checked = false;
        return v;
      });
      this.setData({
        editCartList: this.data.cartGoods,
        cartGoods: tmpCartList,
        isEditCart: !this.data.isEditCart,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }

  },
  updateCart: function (line_item_id, quantity) {
    let that = this;
    util.request(api.ApiRootUrl + 'carts/update', {
      line_item_id: line_item_id,
      quantity: quantity,
    }, 'POST').then(function (res) {
        console.log(res.data);
        that.setData({
          cartGoods: res.data.line_items,
          cart: res.data
        });

      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });

  },
  cutNumber: function (event) {

    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    let number = (cartItem.quantity - 1 > 1) ? cartItem.quantity - 1 : 1;
    cartItem.quantity = number;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateCart(cartItem.id, number);
  },
  addNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    let number = cartItem.quantity + 1;
    cartItem.quantity = number;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateCart(cartItem.id, number);

  },
  checkoutOrder: function () {
    // 获取已选择的商品
    let that = this;

    var checkedGoods = this.data.cartGoods.filter(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });

    if (checkedGoods.length <= 0) {
      return false;
    }
    wx.navigateTo({
      url: '../shopping/checkout/checkout'
    })
  },
  deleteCart: function () {
    //获取已选择的商品
    let that = this;

    let productIds = this.data.cartGoods.filter(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });

    if (productIds.length <= 0) {
      return false;
    }

    productIds = productIds.map(function (element, index, array) {
      if (element.checked == true) {
        return element.id;
      }
    });


    util.request(api.ApiRootUrl + 'carts/remove', {
      line_item_ids: productIds.join(',')
    }, 'POST').then(function (res) {
        console.log(res.data);
        let cartList = res.data.line_items.map(v => {
          console.log(v);
          v.checked = false;
          return v;
        });

        that.setData({
          cartGoods: cartList,
          cart: res.data
        });

      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });
  }
})