const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getTagList = (tagstr, tagList) => {
  var ret = []
  if (!tagstr) return ret
  var tags = tagstr.split(',')
  return tagList.filter(x => tags.indexOf(x["name"]) != -1)
}

const navToOrderDetail = (e) => {
  var id = e.currentTarget.dataset.id
  wx.navigateTo({
    url: '/pages/orderdetail/orderdetail?id=' + id
  })
}

const navToSellDetail = (e) => {
  var id = e.currentTarget.dataset.id
  wx.navigateTo({
    url: '/pages/selldetail/selldetail?id=' + id
  })
}

const navToItemDetail = (e) => {
  var id = e.currentTarget.dataset.id
  wx.navigateTo({
    url: '/pages/item/item?id=' + id
  })
}

module.exports = {
  formatTime: formatTime,
  getTagList: getTagList,
  navToOrderDetail: navToOrderDetail,
  navToSellDetail: navToSellDetail,
  navToItemDetail: navToItemDetail
}
