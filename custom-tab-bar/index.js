Component({
  data: {
    selected: 0,
    list: [{
      color: "#000",
      selectedColor: "#000",
      pagePath: "/pages/index/index",
      withIcon: false,
      text: "首页"
    }, {
      color: "#fff",
      selectedColor: "#fff",
      pagePath: "/pages/postitem/postitem",
      withIcon: true,
      text: "发布二手"
    },{
      color: "#000",
      selectedColor: "#000",
      pagePath: "/pages/personal/personal",
      withIcon: false,
      text: "我的"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})