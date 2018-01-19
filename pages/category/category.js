var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    // text:"这是一个页面"
    navList: [],
    goodsList: [],
    id: 0,
    metaTitle: '',
    metaDescription: '',
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    page: 1,
    size: 10000
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
      that.setData({
        metaTitle: options.metaTitle,
        metaDescription: options.metaDescription
      });
    console.log("metaTitle:", this.data.metaTitle)

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });

    this.getGoodsList();

  },

  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    console.log(1);
  },
  onHide: function () {
    // 页面隐藏
  },
  getGoodsList: function () {
    var that = this;
    var category_name = this.data.metaTitle
    util.request(api.ApiRootUrl + 'products', { category_name: category_name })
      .then(function (res) {
        that.setData({
          goodsList: res.data.products,
        });
      });
  },
  onUnload: function () {
    // 页面关闭
  },
  switchCate: function (event) {
    if (this.data.id == event.currentTarget.dataset.id) {
      return false;
    }
    var that = this;
    var clientX = event.detail.x;
    var currentTarget = event.currentTarget;
    if (clientX < 60) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft - 60
      });
    } else if (clientX > 330) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft
      });
    }
    this.setData({
      id: event.currentTarget.dataset.id
    });

    this.getCategoryInfo();
  }
})