var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    name: '',
    mobile: '',
    vehicle_type: '',
  },

  onLoad: function () {
    let that = this
    util.request(api.ApiRootUrl + 'users/info').then(function (res) {
      that.setData({
        name: res.data.name ? res.data.name : wx.getStorageSync('userInfo').nickName,
        mobile: res.data.mobile,
        vehicle_type: res.data.vehicle_type
      });
    });

  },
  onReady: function () {

  },

  saveInfo(e) {
    if (e.detail.value.name == '') {
      util.showErrorToast('请输入姓名');
      return false;
    }
    if (e.detail.value.mobile == '') {
      util.showErrorToast('请输入手机号码');
      return false;
    }
    if (e.detail.value.mobile.length != 11) {
      util.showErrorToast('请输入正确的手机号');
      return false;
    }

    let that = this;
    util.request(api.ApiRootUrl + 'users/info', {
      name: e.detail.value.name,
      mobile: e.detail.value.mobile,
      vehicle_type: e.detail.value.vehicle_type
    }, 'POST').then(function (res) {
      wx.navigateBack()
      // wx.navigateTo({
      //   url: '/pages/ucenter/address/address',
      // })
    });

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