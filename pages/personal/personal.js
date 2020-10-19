// pages/personal/personal.js
var api = require("../../utils/api.js")
const app = getApp()

Component({
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
      var that = this
      // 发送请求获取客服电话
      api.phpRequest({
        url: 'phone.php',
        success: function (res) {
          that.setData({
            phone: res.data.phone
          })
        }
      })
      var userId = wx.getStorageSync('userId')
      if (userId) {
        // 发送请求获取用户信息
        api.phpRequest({
          url: 'info.php',
          data: {
            userid: userId
          },
          success: function (res) {
            console.log(res)
            that.setData({
              userInfo: res.data
            })
          }
        })
      } else {
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: null,
    phone: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navigateToCollect: function (e) {
      wx.navigateTo({
        url: '/pages/collect/collect',
      })
    },
  
    navigateToPostList: function (e) {
      wx.navigateTo({
        url: '/pages/postlist/postlist',
      })
    },
  
    navigateToWallet: function (e) {
      wx.navigateTo({
        url: '/pages/wallet/wallet',
      })
    },

    navigateToOrder: function (e) {
      var tabid = e.currentTarget.dataset.tab
      wx.navigateTo({
        url: '/pages/order/order?tabid=' + tabid,
      })
    },

    navigateToAgent: function (e) {
      var tabid = e.currentTarget.dataset.tab
      wx.navigateTo({
        url: '/pages/agentorder/list?tabid=' + tabid,
      })
    },
  
    contact: function () {
      var that = this
      wx.showModal({
        title: '客服热线',
        content: '拨打' + that.data.phone + '热线，联系官方客服',
        showCancel: true,
        confirmText: '确认',
        success: function (res) {
          if (res.confirm) {
            wx.makePhoneCall({
              phoneNumber: that.data.phone
            })
          }
        }
      })
    },

    logout: function () {
      wx.removeStorageSync('userId')
      app.globalData.userInfo = null
      app.globalData.tagList = null
      app.globalData.typeList = null
      app.globalData.pickIdx = null
      wx.reLaunch({
        url: '../index/index'
      })
    }
  }
})