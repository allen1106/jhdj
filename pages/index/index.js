// pages/index/index.js
var api = require("../../utils/api.js")
var utils = require("../../utils/util.js")
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    host: api.HTTP_HOST,
    background: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    typeList: [],
    recommendList: [],
    latestItemList: [],
    oldList: [],
    searchHandler: null,
    latestItemList: [],
    bindTapHandler: utils.navToItemDetail
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    var that = this
    that.setData({
      searchHandler: that.searchHandler
    })
    // 获取banner图片列表
    api.phpRequest({
      url: 'adverlist.php',
      success: function (res) {
        that.setData({
          background: res.data,
        })
      }
    })
    // 获取商品分类列表
    api.phpRequest({
      url: 'category.php',
      success: function (res) {
        that.setData({
          typeList: res.data,
        })
      }
    })
    // 获取推荐商品列表
    api.phpRequest({
      url: 'recommend.php',
      success: function (res) {
        that.setData({
          recommendList: res.data,
        })
      }
    })
  },

  onShow: function (e) {
    var that = this
    // 检索商品列表
    api.phpRequest({
      url: 'products.php',
      data: {'page': 1},
      success: function (res) {
        for (var i in res.data) {
          res.data[i].imgs = res.data[i].imgs && res.data[i].imgs.split(',')
          res.data[i].label = utils.getTagList(res.data[i].label, app.globalData.tagList)
        }
        console.log(res.data)
        that.setData({
          latestItemList: res.data,
        })
      }
    })

    api.phpRequest({
      url: 'old.php',
      success: function (res) {
        for (var i in res.data) {
          res.data[i].imgs = res.data[i].imgs && res.data[i].imgs.split(',')
          res.data[i].label = utils.getTagList(res.data[i].label, app.globalData.tagList)
        }
        console.log(res.data)
        that.setData({
          oldList: res.data,
        })
      }
    })
  },

  navigateItemList: function (e) {
    var typeId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/itemlist/itemlist?typeId=' + typeId,
    })
  },

  navigateItemDetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/item/item?id=' + id,
    })
  },

  searchHandler: function (searchWords) {
    if (!searchWords.trim()) {
      wx.showToast({
        icon: 'none',
        title: '请输入您要搜索的关键字'
      })
    } else {
      wx.navigateTo({
        url: '/pages/itemlist/itemlist?key=' + searchWords
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})