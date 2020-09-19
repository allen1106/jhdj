// components/searchInput/search.js
Component({
  externalClasses: ['my-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    searchHandler: {
      type: Function,
      observer: function (newVal, oldVal) { }
    },
    searchWords: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    searchWords: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _bindSearch: function () {
      this.data.searchHandler(this.data.searchWords)
    },
    _bindinput: function (e) {
      this.setData({
        searchWords: e.detail.value
      })
    }
  }
})
