// pages/item/item.js
var api = require("../../utils/api.js")
var utils = require("../../utils/util.js")
var WxParse = require('../../wxParse/wxParse.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    itemInfo: null,
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var id = Number(options.id)
    api.phpRequest({
      url: 'detail.php',
      data: {
        id: id
      },
      success: function (res) {
        res.data.imgs = res.data.imgs && res.data.imgs.split(',')
        res.data.desc = res.data.desc ? res.data.desc : ""
        res.data.label = utils.getTagList(res.data.label, app.globalData.tagList)
        that.setData({
          id: id,
          itemInfo: res.data,
        })
        WxParse.wxParse('article', 'html', that.data.itemInfo.content, that, 5)
      }
    })
  },

  navBack: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  
  _bindCollect: function (e) {
    var that = this
    api.phpRequest({
      url: 'collection.php',
      data: {
        goods_id: that.data.itemInfo.id,
        userid: wx.getStorageSync('userId')
      },
      success: function (res) {
        if (res.data.status == 1) {
          wx.showToast({
            title: '收藏成功',
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: '收藏失败，请重试',
            icon: 'none'
          })
        }
      }
    })
  },
  _bindPurchase: function (e) {
    var that = this
    api.phpRequest({
      url: 'buy.php',
      data: {
        goods_id: that.data.itemInfo.id,
        userid: wx.getStorageSync('userId')
      },
      success: function (res) {
        if (res.data.status == 1) {
          wx.navigateTo({
            url: '/pages/buyitem/buyitem?orderid=' + res.data.orderid,
          })
        } else {
          wx.showToast({
            title: '收藏失败，请重试',
            icon: 'none'
          })
        }
      }
    })
  },
  previewImg: function (e) {
    var that = this
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: that.data.itemInfo.imgs
    })
  },
})