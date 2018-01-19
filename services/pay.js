/**
 * 支付相关服务
 */

const util = require('../utils/util.js');
const api = require('../config/api.js');
var user = require('./user.js');

/**
 * 判断用户是否登录
 */
function payOrder(orderId) {
  return new Promise(function (resolve, reject) {
    util.request(api.ApiRootUrl + 'orders/' + orderId + '/mp_pay_params').then((res) => {
      console.log(res)
      const payParam = res.data.pay_params;
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            resolve(res);
          },
          'fail': function (res) {
            reject(res);
          },
          'complete': function (res) {
            reject(res);
          }
        });
     
    });
  });
}


module.exports = {
  payOrder,
};











