# weekly-mp
科技爱好者周刊小程序版

### 界面效果

| 首页 | 详情页 |
|---|---|
|<img src="http://cdn.xuedingmiao.com/weekly-home.jpg" style="margin-right:5px;">|<img src="http://cdn.xuedingmiao.com/weekly-detail.jpg">|

#### 与语雀的界面对比

| 语雀中周刊的列表页 | 详情页 |
|---|---|
|<img src="http://cdn.xuedingmiao.com/yuque-list.jpg" style="margin-right:5px;">|<img src="http://cdn.xuedingmiao.com/yuque-detail.jpg">|

- 以下是使用方式上的一些差异，仅供参考

| 使用上的差异 | 入口层级 | 分享 | 订阅 |
|---|---|---|---|
| 语雀内的 | 层级较深 | 支持分享海报及发送给朋友(右上角胶囊菜单不支持分享给朋友及朋友圈) | 关注后开启推送 |
| 本小程序 | 点击即用 | 支持右上角胶囊菜单分享给朋友及朋友圈 | 功能已增加，暂未开放 |


### 技术选型

#### 小程序端

- 主框架使用 mpvue
- UI框架采用 Lin-ui
- 渲染插件使用 wemark

#### 服务端

- 小程序云开发部署若干云函数
    - weeklies：获取周刊列表
    - weekly：获取周刊 markdown 数据
- 服务器部署基于 koa 框架开发的接口

### 架构方案

主体采用服务器加云开发混合部署，如下图所示：

![科技爱好者周刊小程序架构设计](http://cdn.xuedingmiao.com/weekly-mp-struct.png)

- 服务器定期从 github 拉取最新文章的 markdown 文件，并进行基础的数据处理，生成文章的 json 缓存文件
- 小程序内调用云函数后从独立服务器获取文章数据进行展示
- 文章内页的数据为markdown类型故采用开源插件 wemark 进行渲染

### 体验方法

| 扫码体验 | 微信搜索『科技爱好者周刊』 |
|---|---|
|<img src="http://cdn.xuedingmiao.com/science-lover.jpg" style="margin-right:5px;">|<img src="http://cdn.xuedingmiao.com/search-weekly.jpg">|

### 参考资料
- 微信小程序 markdown 渲染库 [wemark](https://github.com/TooBug/wemark)
- [科技爱好者周刊](https://github.com/ruanyf/weekly)
- [git log 命令参考](http://xuedingmiao.com/blog/git_log.html)
- [Lin UI](https://doc.mini.talelin.com/)
- [小程序云开发实战：从零搭建科技爱好者周刊小程序](http://xuedingmiao.com/blog/science_lover.html)

### 致谢
再次致谢阮一峰老师 😄