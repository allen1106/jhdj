// pages/login/login.js
var api = require("../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  login: function (e) {
    wx.login({
      success (res) {
        if (res.code) {
          console.log(res.code)
          console.log(e.detail.userInfo)
          api.phpRequest({
            url: 'login.php',
            data: {
              code: res.code,
              avatar_url: e.detail.userInfo.avatarUrl,
              gender: e.detail.userInfo.gender,
              nickname: e.detail.userInfo.nickName
            },
            success: function (res) {
              wx.setStorageSync('userId', res.data.userid)
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }
})