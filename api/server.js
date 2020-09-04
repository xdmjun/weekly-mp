const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const fg = require('fast-glob')
const fs = require('fs')
const request = require('request')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const execSync = require('child_process').execSync
const path = require('path')
const mime = require('mime-types')
const cors = require('koa2-cors')
let config = require('./config.js')
const moment = require('moment')
const blog_md_path = config.base_path + '*.md',
  tokenUrl = config.tokenUrl,
  appid = config.appid,
  appsecret = config.appsecret,
  mpAppid = config.mpAppid,
  mpAppsecret = config.mpAppsecret,
  env = config.env

// user agent
const { userAgent } = require('koa-useragent')
app.use(userAgent)

app.use(cors())

// 全局异常处理
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.body = {
      code: -1,
      data: ctx.data,
      message: ctx.msg || err.message || '服务开小差了，请稍后再试',
      etime: Date.now(),
    }
  }
})

// pretty json result
app.use(async (ctx, next) => {
  await next()
  if (!ctx.mimeType) {
    ctx.set('Content-Type', 'application/json')
    ctx.body = {
      code: ctx.code || 0,
      data: ctx.data,
      message: ctx.msg || 'success',
      etime: Date.now(),
    }
  } else {
    ctx.set('content-type', ctx.mimeType)
    ctx.body = ctx.data
  }
})

router.get('/', async (ctx, next) => {
  ctx.data = 'weekly api'
  await next()
})

// 获取公众号/小程序全局token
router.get('/getToken', async (ctx, next) => {
  let type = ctx.request.query.type || 'gzh',
    tokenFileName = 'token_info.json'
  if (type == 'mp') {
    tokenFileName = 'mp_token_info.json'
  }
  let tokenInfo = fs.existsSync(tokenFileName)
    ? JSON.parse(fs.readFileSync(tokenFileName, 'utf-8'))
    : null
  let expires_time = tokenInfo ? tokenInfo.expires_time : ''
  let cache_access_token =
    tokenInfo && tokenInfo.access_token ? tokenInfo.access_token : ''
  if (
    parseInt(Date.now() / 1000) > expires_time + 3600 ||
    tokenInfo == null ||
    cache_access_token == ''
  ) {
    let tokenForUrl
    if (type == 'mp') {
      tokenForUrl =
        tokenUrl +
        '?grant_type=client_credential&appid=' +
        mpAppid +
        '&secret=' +
        mpAppsecret
    } else {
      tokenForUrl =
        tokenUrl +
        '?grant_type=client_credential&appid=' +
        appid +
        '&secret=' +
        appsecret
    }
    let tokenInfoNew = await new Promise(function (resolve, reject) {
      request.get(tokenForUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(body)
        }
        reject(error)
      })
    })
    tokenInfoNew = JSON.parse(tokenInfoNew)
    cache_access_token = tokenInfoNew.access_token
    expires_time = parseInt(Date.now() / 1000)
    fs.writeFileSync(
      tokenFileName,
      JSON.stringify({
        access_token: cache_access_token,
        expires_time: expires_time,
      })
    )
    ctx.data = { token: cache_access_token, expires_time: expires_time }
  } else {
    ctx.data = {
      token: tokenInfo.access_token,
      expires_time: tokenInfo.expires_time,
    }
  }
  await next()
})

// 获取小程序码
router.get('/getWxaCode', async (ctx, next) => {
  let page = ctx.request.query.page || 'pages/index/main',
    token = ctx.request.header.token || ''

  // 拼接本地文件路径
  let codePic, scene
  if (page.indexOf('?') != -1) {
    scene = page.split('?')[1].split('=')[1]
    page = page.split('?')[0]
    codePic = path.join(__dirname, 'public/' + scene + '.jpg')
  } else {
    codePic = path.join(
      __dirname,
      'public/' + page.replace(/\//g, '-') + '.jpg'
    )
  }

  // 文件不存在时请求接口重新生成小程序码
  if (!fs.existsSync(codePic)) {
    console.log(page)
    console.log(scene)
    // 获取小程序码配置
    const codeOptions = {
      method: 'POST',
      url:
        'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + token,
      body: {
        page: page,
        width: 230,
        scene: scene || 'pc=1',
      },
      json: true,
      encoding: null,
    }
    // 获取小程序码图片Buffer
    let imgBuffer = await new Promise(function (resolve, reject) {
      request.post(codeOptions, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(body)
        }
        reject(error)
      })
    })

    fs.writeFileSync(codePic, imgBuffer, function (err) {
      //生成图片(把buffer写入到图片文件)
      if (err) {
        console.log(err)
      }
    })
  }
  let codeFile = fs.readFileSync(codePic)
  ctx.mimeType = mime.lookup(codePic)
  ctx.data = codeFile
  await next()
})

// 生成周刊列表json
router.get('/weeklies/init', async (ctx, next) => {
  // 拉取最新markdown文件
  const { stdout, stderr } = await exec(
    'cd ' + config.base_path + ' && cd ../ && git pull'
  )
  if (stderr == '') {
    // 读取md文件列表
    let blog_routes = await fg(blog_md_path, {
      onlyFiles: true,
      cwd: __dirname,
      deep: 1,
    })
  
    ctx.data = '仓库更新成功->' + stdout + (await initTitle(blog_routes))
  } else {
    ctx.data = stderr
  }
  await next()
})

// 更新云数据库记录
router.get('/tcb/notice', async (ctx, next) => {
  let allblogs = await getTitleFromJson(),
    title = JSON.parse(allblogs)[0].title,
    time = JSON.parse(allblogs)[0].date

  let tokenRs = await new Promise(function (resolve, reject) {
    request(
      'http://localhost:' + config.serverPort + '/getToken?type=mp',
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(body)
        }
        reject(error)
      }
    )
  })

  let token = JSON.parse(tokenRs).data.token
  title = title.replace(/\"/g, "'")
  let updStr = 'data:{upd:true,blogname:"' + title + '",time:"' + time + '"}'
  const options = {
    method: 'POST',
    url: 'https://api.weixin.qq.com/tcb/databaseupdate?access_token=' + token,
    body: {
      env: env,
      query:
        'db.collection("messages").where({done:false}).update({data:{' +
        updStr +
        '}})',
    },
    json: true,
    encoding: null,
  }

  let rs = await new Promise(function (resolve, reject) {
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body)
      }
      reject(error)
    })
  })

  ctx.data = rs
  await next()
})

// 获取周刊列表
router.get('/weeklies', async (ctx, next) => {
  let allweekly = await getTitleFromJson()
  let pagesize = 30
  let page = ctx.request.query.page || 1
  let total = allweekly.length
  let maxpage = 1
  if (total % pagesize === 0) {
    maxpage = parseInt(total / pagesize)
  } else {
    maxpage = parseInt(total / pagesize) + 1
  }
  if (page > maxpage) {
    page = maxpage
  }
  let first = (page - 1) * pagesize
  let weeklyList = JSON.parse(allweekly).slice(first, first + pagesize)
  ctx.data = weeklyList
  await next()
})

// 博客搜索
router.get('/blogs/search/:name', async (ctx, next) => {
  let allblogs = await getTitleFromJson(),
    recblogs = [],
    blogName = ctx.params.name
  JSON.parse(allblogs).map((blog) => {
    if (blog.title.includes(blogName)) {
      recblogs.push(blog)
    }
  })
  let pagesize = 30
  let page = ctx.request.query.page || 1
  let total = recblogs.length
  let maxpage = 1
  if (total % pagesize === 0) {
    maxpage = parseInt(total / pagesize)
  } else {
    maxpage = parseInt(total / pagesize) + 1
  }
  if (page > maxpage) {
    page = maxpage
  }
  let first = (page - 1) * pagesize
  let blogList = recblogs.slice(first, first + pagesize)
  ctx.data = blogList
  await next()
})

// 获取周刊内容
router.get('/weekly/:name', async (ctx, next) => {
  ctx.data = await getContent(ctx.params.name)
  await next()
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(config.serverPort)

// 生成标题json数据
async function initTitle(weekly_routes) {
  let weekly_array = []
  weekly_routes.forEach((row) => {
    if (row.indexOf('issue') != -1) {
      let file_name = row.substr(row.lastIndexOf('/') + 1)
      var data = fs.readFileSync(row, 'utf-8')

      // 最后更新时间
      let dateGit = execSync(
        'cd ' + config.base_path + ' && git log -n 1 -s --format=%cd ' + row
      ).toString()
      let lastdate = moment(new Date(dateGit)).format('YYYY-MM-DD')

      // 标题
      let title = data
        .substring(data.indexOf('#') + 1, data.indexOf('\n'))
        .replace(/\s+/g, '')

      let seq = file_name.substring(
        file_name.indexOf('-') + 1,
        file_name.indexOf('.')
      )

      // 获取第一张图
      let imgReg = /!\[.*\]((.+))/ //匹配img
      let cnt = data
      let imgArr = cnt.match(imgReg) //筛选出所有的img

      // 图后的内容截取作为描述
      let desc = cnt.substr(cnt.indexOf(imgArr[0]) + imgArr[0].length + 2, 90)

      let imgUrl = ''
      if (imgArr && imgArr.length > 0) {
        let url = imgArr[0]
        imgUrl = url.substring(url.indexOf('(') + 1, url.indexOf(')'))
      }

      weekly_array.push({
        title: title,
        seq: seq,
        desc: desc,
        lastdate: lastdate,
        file_name: file_name,
        img: imgUrl,
      })
    }
  })
  weekly_array.sort(function (a, b) {
    return b.seq - a.seq
  })
  fs.writeFileSync('blogs.json', JSON.stringify(weekly_array))
  return '生成' + weekly_array.length + '条记录'
}

// 从json文件获取博客标题
async function getTitleFromJson() {
  let blogs = fs.readFileSync('blogs.json', 'utf-8')
  return blogs
}

// 获取内容
async function getContent(name) {
  var data = fs.readFileSync(config.base_path + name, 'utf-8')
  let blogCont = {}
  blogCont.title = data.substring(data.indexOf('#'), data.indexOf('\n'))
  blogCont.content = data
  return blogCont
}
