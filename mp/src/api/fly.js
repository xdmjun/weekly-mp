import Fly from 'flyio/dist/npm/wx'
const fly = new Fly()

// 添加请求拦截器
fly.interceptors.request.use(request => {
  const token = mpvue.getStorageSync('token') || ''
  const orgToken = mpvue.getStorageSync('orgToken') || ''
  let contentType = 'application/json'
  request.headers = {
    'X-Tag': 'flyio',
    'content-type': contentType,
    'user-token': token,
    'org-token': orgToken,
  }
  request.body &&
    Object.keys(request.body).forEach(val => {
      if (request.body[val] === '') {
        delete request.body[val]
      }
    })
  if (request.body) {
    let arr = request.body.split('&')
    let obj = {}
    for (let i of arr) {
      obj[i.split('=')[0]] = i.split('=')[1]
    }
    request.body = obj
  }
  return request
})

// 添加响应拦截器
fly.interceptors.response.use(
  res => {
    // 正常返回
    if (res.status === 200 && res.data && res.data.code === 0) {
      res.data.status = 0
    } else {
      res.data.status = 1
    }
    return res.data
  },
  error => {
    // 异常返回
    if (error.response) {
      error.response.data.status = 0
      switch (error.response.status) {
        case 403: // token 为空
          mpvue.setStorageSync('token', '')
          mpvue.redirectTo({
            url: '../login/main',
          })
          break
        case 401: // token 失效
          mpvue.setStorageSync('token', '')
          mpvue.redirectTo({
            url: '../login/main',
          })
          break
        default:
          return error.response.data
      }
    }
  },
)

export default fly
