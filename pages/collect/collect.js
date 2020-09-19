// pages/collect/collect.js
var api = require("../../utils/api.js")
var util = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: '',
    searchHandler: null,
    itemList: [],
    bindTapHandler: util.navToItemDetail
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
    this.fetchDataList()
  },
  searchHandler: function (searchWord) {
    this.setData({
      key: searchWord.trim()
    }, this.fetchDataList)
  },
  fetchDataList: function () {
    var that = this
    // 检索收藏列表
    var data = {
      'userid': wx.getStorageSync('userId')
    }
    if (that.data.key) {data['key'] = that.data.key}
    api.phpRequest({
      url: 'collectionlist.php',
      data: data,
      success: function (res) {
        for (var i in res.data) {
          res.data[i].img = res.data[i].imgs && res.data[i].imgs.split(',')[0]
        }
        that.setData({
          itemList: res.data,
        })
      }
    })
  }
})