let cache = null
export default function getSafeArea() {
  return new Promise((resolve, reject) => {
    if (cache != null) {
      // 如果有缓存不行行调用
      resolve(cache)
    } else {
      // 获取系统信息
      wx.getSystemInfo({
        success: ({ model, screenHeight, statusBarHeight }) => {
          const iphoneX = /iphone x/i.test(model)
          const iphoneNew = /iPhone11/i.test(model) && screenHeight === 812
          cache = {
            isIPhoneX: iphoneX || iphoneNew,
            statusBarHeight,
          }
          resolve(cache)
        },
        fail: reject,
      })
    }
  })
}
