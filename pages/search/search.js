var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp()
Page({
  data: {
    keywrod: '',
    searchStatus: false,
    goodsList: [],
    defaultKeyword: {},
    page: 1,
    size: 20,
    totalPages: 1
  },
  //事件处理函数
  closeSearch: function () {
    wx.navigateBack()
  },
  clearKeyword: function () {
    this.setData({
      keyword: '',
      searchStatus: false
    });
  },
  onLoad: function () {

  },

  getGoodsList: function () {
    let that = this;
    util.request(api.ApiRootUrl + 'products', { keyword: that.data.keyword, page: that.data.page, per_page: that.data.size }).then(function (res) {

        that.setData({
          searchStatus: true,
          categoryFilter: false,
          goodsList: res.data.products,
          page: res.header['X-Page'],
          size: res.header['X-Per-Page'],
          totalPages: Number(res.header['X-Total-Pages'])
        });
      
    });
  },

  loadMore: function () {
    let that = this;
    util.request(api.ApiRootUrl + 'products', { keyword: that.data.keyword, page: that.data.page, per_page: that.data.size }).then(function (res) {
      that.setData({
        searchStatus: true,
        categoryFilter: false,
        goodsList: that.data.goodsList.concat(res.data.products),
        page: res.header['X-Page'],
        size: res.header['X-Per-Page'],
        totalPages: Number(res.header['X-Total-Pages'])
      });

    });
  },
  

  onKeywordTap: function (event) {

    this.getSearchResult(event.target.dataset.keyword);

  },
  getSearchResult(keyword) {
    this.setData({
      keyword: keyword,
      page: 1,
      goodsList: []
    });

    this.getGoodsList();
  },
  
  onKeywordConfirm(event) {
    this.getSearchResult(event.detail.value);
  },
  onReachBottom() {
    if (this.data.totalPages > this.data.page) {
      this.setData({
        page: Number(this.data.page) + 1
      });
    } else {
      return false;
    }

    this.loadMore();
  },
})