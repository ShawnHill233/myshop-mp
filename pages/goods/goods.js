var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    id: 0,
    goods: {},
    showModalStatus: false,
    gallery: [],
    attribute: [],
    issueList: [],
    comment: [],
    brand: {},
    specificationList: [],
    productList: [],
    relatedGoods: [],
    cartGoodsCount: 0,
    userHasCollect: 0,
    number: 1,
    checkedSpecText: '请选择规格属性',
    noCollectImage: "/static/images/icon_collect.png",
    hasCollectImage: "/static/images/icon_collect_checked.png",
    collectBackImage: "/static/images/icon_collect.png",
  },
  getGoodsInfo: function () {
    let that = this;
    util.request(api.ApiRootUrl + "products/" + that.data.id).then(function (res) {
      console.log("goods res...", res)

      that.setData({
        goods: res.data,
        gallery: res.data.images.large,
        attribute: res.data.product_properties,
        // issueList: res.data.issue,
        // comment: res.data.comment,
        // brand: res.data.brand,
        specificationList: res.data.option_types,
        productList: res.data.variants,
        // userHasCollect: res.data.userHasCollect
      });
      console.log("gallery...", that.data.gallery)

      // if (res.data.userHasCollect == 1) {
      //   that.setData({
      //     'collectBackImage': that.data.hasCollectImage
      //   });
      // } else {
      //   that.setData({
      //     'collectBackImage': that.data.noCollectImage
      //   });
      // }

      WxParse.wxParse('goodsDetail', 'html', res.data.details, that);

      // that.getGoodsRelated();
    });
  },
  getGoodsRelated: function () {
    let that = this;
    util.request(api.GoodsRelated, { id: that.data.id }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          relatedGoods: res.data.goodsList,
        });
      }
    });

  },
  clickSkuValue: function (event) {
    let that = this;
    let specNameId = event.currentTarget.dataset.nameId;
    let specValueId = event.currentTarget.dataset.valueId;
    //判断是否可以点击

    //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      if (_specificationList[i].id == specNameId) {
        for (let j = 0; j < _specificationList[i].option_values.length; j++) {
          if (_specificationList[i].option_values[j].id == specValueId) {
            //如果已经选中，则反选
            if (_specificationList[i].option_values[j].checked) {
              _specificationList[i].option_values[j].checked = false;
            } else {
              _specificationList[i].option_values[j].checked = true;
            }
          } else {
            _specificationList[i].option_values[j].checked = false;
          }
        }
      }
    }
    this.setData({
      'specificationList': _specificationList
    });
    //重新计算spec改变后的信息
    this.changeSpecInfo();

    //重新计算哪些值不可以点击
  },

  //获取选中的规格信息
  getCheckedSpecValue: function () {
    let checkedValues = [];
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      let _checkedObj = {
        nameId: _specificationList[i].id,
        valueId: 0,
        valueText: ''
      };
      for (let j = 0; j < _specificationList[i].option_values.length; j++) {
        if (_specificationList[i].option_values[j].checked) {
          _checkedObj.valueId = _specificationList[i].option_values[j].id;
          _checkedObj.valueText = _specificationList[i].option_values[j].name;
        }
      }
      checkedValues.push(_checkedObj);
    }

    return checkedValues;

  },
  //根据已选的值，计算其它值的状态
  setSpecValueStatus: function () {

  },
  //判断规格是否选择完整
  isCheckedAllSpec: function () {
    return !this.getCheckedSpecValue().some(function (v) {
      if (v.valueId == 0) {
        return true;
      }
    });
  },
  getCheckedSpecKey: function () {
    let checkedValue = this.getCheckedSpecValue().map(function (v) {
      return v.valueId;
    });

    return checkedValue;
  },
  changeSpecInfo: function () {
    let checkedNameValue = this.getCheckedSpecValue();

    //设置选择的信息
    let checkedValue = checkedNameValue.filter(function (v) {
      if (v.valueId != 0) {
        return true;
      } else {
        return false;
      }
    }).map(function (v) {
      return v.valueText;
    });
    if (checkedValue.length > 0) {
      this.setData({
        'checkedSpecText': checkedValue.join('　')
      });
    } else {
      this.setData({
        'checkedSpecText': '请选择规格属性'
      });
    }

  },
  getCheckedProductItem: function (key) {
    if (this.data.goods.variants.length > 0) {
      return this.data.productList.filter(function (v) {
        var option_value_ids = v.option_values.map(function (ov) {
          return ov.id;
        });
        if (option_value_ids.sort().join(',') == key.sort().join(',')) {
          return true;
        } else {
          return false;
        }
      })[0];
    } else {
      return this.data.goods.master
    }

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      id: parseInt(options.id)
      // id: 1181000
    });
    var that = this;
    this.getGoodsInfo();
    util.request(api.ApiRootUrl + 'carts').then(function (res) {
      that.setData({
        cartGoodsCount: res.data.items_count
      });
    });
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

  },

  openCartPage: function () {
    wx.switchTab({
      url: '/pages/cart/cart',
    });
  },
  addToCart: function () {
    var that = this;
    if (this.data.showModalStatus == false) {
      this.showModal();
    } else {
      //提示选择完整规格
      if (!this.isCheckedAllSpec()) {
        wx.showToast({
          icon: 'none',
          title: '请选择规格型号',
          mask: true
        });
        return false;
      }

      //根据选中的规格，判断是否有对应的sku信息
      let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
      if (!checkedProduct || checkedProduct.length <= 0) {
        console.log("no product variant")
        //找不到对应的product信息，提示没有库存
        return false;
      }

      //验证库存
      if (checkedProduct.goods_number < this.data.number) {
        //找不到对应的product信息，提示没有库存
        return false;
      }

      //添加到购物车
      console.log('cart add request start')
      var _variant_id = checkedProduct.id
      util.request(api.ApiRootUrl + 'carts/add', { variant_id: _variant_id, quantity: this.data.number }, "POST").then(function (res) {
        console.log('cart add request res..', res)
        let _res = res;
        // if (_res.error != null) {
        wx.showToast({
          title: '添加成功'
        });
        that.setData({
          cartGoodsCount: _res.data.items_count
        });
        if (that.data.userHasCollect == 1) {
          that.setData({
            'collectBackImage': that.data.hasCollectImage
          });
        } else {
          that.setData({
            'collectBackImage': that.data.noCollectImage
          });
        }
        // } else {
        //   wx.showToast({
        //     image: '/static/images/icon_error.png',
        //     title: _res.errmsg,
        //     mask: true
        //   });
        // }

      });
    }


  },
  cutNumber: function () {
    this.setData({
      number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
    });
  },
  addNumber: function () {
    this.setData({
      number: this.data.number + 1
    });
  },

  buyNow: function () {
    this.showModal();
    // wx.navigateTo({
    //   url: '../shopping/checkout/checkout?type=buyNow&variantId=' +  this.data.goods.id + '&quantity=' + this.data.number
    // })
  },


  showModal: function () {
    //背景动画
    var bodyAnimation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear',
    })
    this.bodyAnimation = bodyAnimation
    bodyAnimation.scale(0.9, 0.9).step()
    this.setData({
      bodyAnimationData: bodyAnimation.export()
    })
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    // setTimeout(function () {
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export()
    })
    // }.bind(this), 200)

  },
  hideModal: function () {
    //背景动画
    var bodyAnimation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear',
    })
    this.bodyAnimation = bodyAnimation
    bodyAnimation.scale(1, 1).step()
    this.setData({
      bodyAnimationData: bodyAnimation.export()
    })
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    // setTimeout(function () {
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: false
    })
    // }.bind(this), 200)

  },
})