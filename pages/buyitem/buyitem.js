// pages/buyitem/buyitem.js
var api = require("../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: null,
    itemInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var orderId = options.orderid
    that.setData({
      orderId: orderId
    })
    api.phpRequest({
      url: 'pay.php',
      data: {
        'userid': wx.getStorageSync('userId'),
        'orderid': orderId
      },
      success: function (res) {
        res.data.img = res.data.imgs && res.data.imgs.split(',')[0]
        that.setData({
          itemInfo: res.data,
        })
      }
    })
  },

  bindPay: function () {
    var that = this
    api.phpRequest({
      url: 'wxpay.php',
      data: {
        userid: wx.getStorageSync('userId'),
        orderid: that.data.orderId
      },
      method: 'post',
      header: {'content-type': 'application/x-www-form-urlencoded'},
      success: function (res) {
        let payInfo = res.data
        wx.requestPayment({
          timeStamp: payInfo.timeStamp,
          nonceStr: payInfo.nonceStr,
          package: payInfo.package,
          signType: 'MD5',
          paySign: payInfo.paySign,
          success (res) {
            wx.showToast({
              title: '支付成功',
            })
            wx.navigateTo({
              url: '/pages/orderdetail/orderdetail?id=' + that.data.orderId
            })
          },
          fail (res) {
            wx.showToast({
              title: '支付失败',
            })
          }
        })
      }
    })
  }
})