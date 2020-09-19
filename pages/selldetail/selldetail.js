// pages/selldetail/selldetail.js
var api = require("../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    orderInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    var that = this
    that.setData({
      id: id
    })
    api.phpRequest({
      url: 'sell.php',
      data: {
        'userid': wx.getStorageSync('userId'),
        'orderid': id
      },
      success: function (res) {
        res.data.img = res.data.imgs && res.data.imgs.split(',')[0]
        that.setData({
          orderInfo: res.data,
        })
      }
    })
  },

  bindConfirmRefund: function (e) {
    var that = this
    api.phpRequest({
      url: 'refundok.php',
      data: {
        'userid': wx.getStorageSync('userId'),
        'orderid': that.data.id
      },
      success: function (res) {
        if (res.data.status == 1) {
          wx.showToast({
            title: '退款成功',
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: '退款失败，请重试',
            icon: 'none'
          })
        }
      } 
    })
  }
})