var util = require('../../utils/util.js');
var api = require('../../config/api.js');


var app = getApp();

Page({
  data: {
    id: 0,
    brand: {},
    goodsList: [],
    page: 1,
    size: 1000
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.setData({
      id: parseInt(options.id)
    });
    this.getBrand();
  },
  getBrand: function () {
    let that = this;
    util.request(api.ApiRootUrl + 'brands/' + that.data.id).then(function (res) {
      that.setData({
        brand: res
      });
      that.getGoodsList();
    });
  },
  getGoodsList() {
    var that = this;

    util.request(api.ApiRootUrl + 'products', { brand_id: that.data.id, page: that.data.page, size: that.data.size })
      .then(function (res) {
        console.log("get goods list res", res)

        that.setData({
          goodsList: res.data.products,
        });
      });
    console.log("goodsList..", that.data.goodsList)
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