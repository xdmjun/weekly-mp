const cloud = require('wx-server-sdk')

exports.main = async (event, context) => {
  cloud.init()
  const db = cloud.database()
  try {
    const { OPENID } = cloud.getWXContext()

    let message = await db
      .collection('messages')
      .where({
        done: false,
        touser: OPENID,
        templateId: event.templateId,
      })
      .get()

    let userInfo = { subscribe: 0 }
    if (message.data.length) {
      userInfo.subscribe = 1
    }

    return userInfo
  } catch (err) {
    console.log(err)
    return err
  }
}
