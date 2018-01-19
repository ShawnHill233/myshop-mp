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
    util.request(api.ApiRootUrl + 'products', { keyword: that.data.keyword, page: that.data.page, size: that.data.size }).then(function (res) {

        console.log("products...", res.data.products)
        that.setData({
          searchStatus: true,
          categoryFilter: false,
          goodsList: res.data.products,
          page: res.data.currentPage,
          size: res.data.numsPerPage
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
  }
})