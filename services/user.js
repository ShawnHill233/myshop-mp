/**
 * 用户相关服务
 */

const util = require('../utils/util.js');
const api = require('../config/api.js');


/**
 * 调用微信登录
 */
function loginByWeixin() {

  let code = null;
  return new Promise(function (resolve, reject) {
    return util.login().then((res) => {
      code = res.code;
      return util.getUserInfo();
    }).then((res) => {
      //保存用户信息
      wx.setStorageSync('userInfo', res.userInfo);
      //登录远程服务器
      util.request(api.ApiRootUrl + 'users/login', { code: code }, 'POST').then(res => {
        if (res.token) {
          //存储用户信息
          // wx.setStorageSync('userInfo', res.data.userInfo);
          wx.setStorageSync('token', res.token);

          resolve(res);
        } else {
          reject(res);
        }
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    })
  });
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
      util.checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });

    } else {
      reject(false);
    }
  });
}


module.exports = {
  loginByWeixin,
  checkLogin,
};











