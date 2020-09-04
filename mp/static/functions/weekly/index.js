// 云函数入口文件
const got = require('got')

// 云函数入口函数
exports.main = async (event, context) => {
  let blogName = event.name
  let res = await got('http://tiaocaoer.com:11191/weekly/' + blogName, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  console.log(res.body)
  return res.body
}
