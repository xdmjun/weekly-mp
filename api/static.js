const Koa = require('koa')
const staticServ = new Koa()
const path = require('path')
const fg = require('fast-glob')

// 静态资源
staticServ.use(require('koa-static')(path.join(__dirname) + '/public'))
staticServ.use(async (ctx) => {
  let pic_routes = await fg(path.join(__dirname) + '/public/*.jpg', {
    onlyFiles: true,
    cwd: __dirname,
    deep: 1,
  })
  let html = '小程序码列表'
  pic_routes.map((pic) => {
    let pic_name = pic.substr(pic.lastIndexOf('/') + 1)
    html += '<div><a href="' + pic_name + '">' + pic_name + '</a></div>'
  })
  ctx.type = 'text/html'
  ctx.body = html
})
staticServ.listen(3001, () => {
  console.log('build success')
})
