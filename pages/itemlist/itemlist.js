// pages/itemlist/itemlist.js
var api = require("../../utils/api.js")
var utils = require("../../utils/util.js")
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cid: null,
    key: '',
    itemList: [],
    searchHandler: null,
    bindTapHandler: utils.navToItemDetail
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var typeId = Number(options.typeId)
    var key = options.key
    that.setData({
      cid: typeId,
      key: key || that.data.key
    })
    that.setData({
      searchHandler: that.searchHandler
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    that.fetchItemList()
  },

  searchHandler: function (searchWords) {
    var that = this
    that.setData({
      key: searchWords.trim()
    }, that.fetchItemList)
  },

  fetchItemList: function () {
    var that = this
    // 检索商品列表
    var data = {'page': 1}
    if (that.data.key) {data['key'] = that.data.key}
    if (that.data.cid) {data['cid'] = that.data.cid}
    api.phpRequest({
      url: 'products.php',
      data: data,
      success: function (res) {
        for (var i in res.data) {
          res.data[i].imgs = res.data[i].imgs && res.data[i].imgs.split(',')
          res.data[i].label = utils.getTagList(res.data[i].label, app.globalData.tagList)
        }
        that.setData({
          itemList: res.data,
        })
      }
    })
  }
})