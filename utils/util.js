const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function hasScreen(otherHeight, onsuccess) {
  wx.getSystemInfo({
    success: function(res) {
      const windowHeight = res.windowHeight * (750 / res.windowWidth);
      const windowWidth = res.windowWidth * (750 / res.windowWidth);

      onsuccess({
        windowHeight: windowHeight - otherHeight,
        windowWidth: windowWidth
      })
    },
  })
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  hasScreen: hasScreen
}
const host = 'http://123.206.174.209:8081';
// const ApiRootUrl = 'https://api.guditech.com'