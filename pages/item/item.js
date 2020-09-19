// pages/item/item.js
var api = require("../../utils/api.js")
var utils = require("../../utils/util.js")
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    itemInfo: null,
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
        res.data.label = utils.getTagList(res.data.label, app.globalData.tagList)
        that.setData({
          id: id,
          itemInfo: res.data,
        })
      }
    })
  }
})