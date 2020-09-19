// components/flatitem/flatitem.js
var api = require("../../utils/api.js")

Component({
  externalClasses: ['my-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    itemInfo: {
      type: Object,
      value: null
    },
    bindTapHandler: {
      type: Function,
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    itemInfo: null,
    host: api.HTTP_HOST,
    bindTapHandler: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _bindTap: function (e) {
      if (this.data.bindTapHandler) {
        this.data.bindTapHandler(e)
      }
    }
  }
})
