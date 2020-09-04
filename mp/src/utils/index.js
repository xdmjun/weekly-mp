export function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function getTimeRange(startTime, endTime) {
  var usedTime = endTime - startTime // 两个时间戳相差的毫秒数
  if (usedTime < 0) {
    return '请选择正确的时间'
  }
  // 计算天数
  var days = Math.floor(usedTime / (24 * 3600 * 1000))
  // 计算出小时数
  var leave1 = usedTime % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))
  // 计算相差分钟数
  var leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000))
  var time
  if (days === 0) {
    if (hours === 0) {
      if (minutes === 0) {
        time = ''
      } else {
        time = minutes + '分钟'
      }
    } else {
      if (minutes === 0) {
        time = hours + '小时'
      } else {
        time = hours + '小时' + minutes + '分钟'
      }
    }
  } else {
    if (hours === 0) {
      if (minutes === 0) {
        time = days + '天'
      } else {
        time = days + '天' + minutes + '分钟'
      }
    } else {
      if (minutes === 0) {
        time = days + '天' + hours + '小时'
      } else {
        time = days + '天' + hours + '小时' + minutes + '分钟'
      }
    }
  }
  return time
}

export function fileDomain(updomain = '') {
  return updomain === 'up' ? 'https://up.com/' : 'https://download.com/'
}

export function formatTime(date, needThousand = false) {
  if (needThousand) {
    date = date * 1000
  }
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  // const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('-')
  const t2 = [hour, minute].map(formatNumber).join(':')
  return `${t1} ${t2}`
}

export function formatDate(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const t1 = [year, month, day]
  return t1
}

/**
 * 从缓存里获取数据
 * @param key
 * @return value
 */
export function getStorageSync(key) {
  return wx.getStorageSync(key)
}

/**
 * 显示加载中
 * @param data
 */
export function showLoading(data) {
  wx.showLoading(data)
}

/**
 * 隐藏加载中
 */
export function hideLoading() {
  wx.hideLoading()
}

/**
 * 将数据保存到缓存
 * @param key
 * @param value
 */
export function setStorageSync(key, value) {
  wx.setStorageSync(key, value)
}

export function formatDateString(n) {
  const str = n
    .toString()
    .substring(0, 19)
    .replace('T', ' ')
  return str || ''
}

export default {
  fileDomain,
  formatNumber,
  formatTime,
  formatDate,
  getStorageSync,
  setStorageSync,
  showLoading,
  hideLoading,
}
