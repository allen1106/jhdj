// pages/wallet/wallet.js
var api = require("../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    withdrawList: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    // 获取用户账户信息
    api.phpRequest({
      url: 'info.php',
      data: {
        userid: wx.getStorageSync('userId')
      },
      success: function (res) {
        that.setData({
          userInfo: res.data
        })
      }
    })
    // 获取提现列表
    api.phpRequest({
      url: 'withdrawallist.php',
      data: {
        userid: wx.getStorageSync('userId')
      },
      success: function (res) {
        that.setData({
          withdrawList: res.data
        })
      }
    })
  },
  navigateToWithdraw: function (e) {
    var that = this
    wx.navigateTo({
      url: '/pages/withdraw/withdraw?balance=' + that.data.userInfo.money,
    })
  }
})