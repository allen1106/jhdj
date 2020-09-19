// pages/postlist/postlist.js
var api = require("../../utils/api.js")
var util = require("../../utils/util.js")
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: '',
    itemList: [],
    searchHandler: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      searchHandler: this.searchHandler
    })
    var key = options.key
    this.setData({
      key: key || this.data.key
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.fetchItemList()
  },
  searchHandler: function (searchWords) {
    this.setData({
      key: searchWords.trim()
    }, this.fetchItemList)
  },
  fetchItemList: function () {
    var that = this
    // 检索发布列表
    var data = {
      'userid': wx.getStorageSync('userId')
    }
    if (that.data.key) {data['key'] = that.data.key}
    api.phpRequest({
      url: 'my_products.php',
      data: data,
      success: function (res) {
        for (var i in res.data) {
          res.data[i].label = util.getTagList(res.data[i].label, app.globalData.tagList)
          res.data[i].imgs = res.data[i].imgs && res.data[i].imgs.split(',')
        }
        that.setData({
          itemList: res.data,
        })
      }
    })
  }
})