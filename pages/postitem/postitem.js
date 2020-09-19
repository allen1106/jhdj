// pages/postitem/postitem.js
var api = require("../../utils/api.js")

Component({
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
      var userId = wx.getStorageSync('userId')
      if (!userId) {
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }
    }
  },

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    itemInfo: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
  }
})