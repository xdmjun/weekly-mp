const cloud = require('wx-server-sdk')

exports.main = async (event, context) => {
  cloud.init()
  const db = cloud.database()

  try {
    // 从云开数据库中查询等待发送的消息列表
    const messages = await db
      .collection('messages')
      .where({
        done: false,
        data: {
          upd: true,
        },
      })
      .get()

    // 循环消息列表
    const sendPromises = messages.data.map(async message => {
      try {
        // 发送订阅消息
        await cloud.openapi.subscribeMessage.send({
          touser: message.touser,
          page: message.page,
          data: {
            thing6: { value: message.data.blogname },
            date4: { value: message.data.time },
          },
          templateId: message.templateId,
        })
        // 发送成功后将消息的状态改为已发送
        return db
          .collection('messages')
          .doc(message._id)
          .update({
            data: {
              done: true,
              data: {
                upd: false,
              },
            },
          })
      } catch (e) {
        return e
      }
    })

    return Promise.all(sendPromises)
  } catch (err) {
    console.log(err)
    return err
  }
}
