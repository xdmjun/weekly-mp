// 云函数入口文件
const got = require('got')

// 云函数入口函数
exports.main = async (event, context) => {
  let page = event.page || 1
  let res = await got('http://tiaocaoer.com:11191/weeklies?page=' + page, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  console.log(res.body)
  return res.body
}
