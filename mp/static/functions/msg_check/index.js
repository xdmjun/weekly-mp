const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {
    const res = await cloud.openapi.security.msgSecCheck({
      content: event.inputText,
    })
    return res
  } catch (err) {
    return err
  }
}
