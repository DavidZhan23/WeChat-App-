// server/utils/wechat.js - 微信API工具
const axios = require('axios')
const crypto = require('crypto')

const APPID = process.env.WECHAT_APPID
const APPSECRET = process.env.WECHAT_APPSECRET

/**
 * 通过 code 获取 openid 和 session_key
 */
async function getOpenIdAndSessionKey(code) {
  const url = `https://api.weixin.qq.com/sns/jscode2session`
  const params = {
    appid: APPID,
    secret: APPSECRET,
    js_code: code,
    grant_type: 'authorization_code'
  }

  try {
    const response = await axios.get(url, { params })
    const { openid, session_key, errcode, errmsg } = response.data

    if (errcode) {
      throw new Error(errmsg || '获取openid失败')
    }

    return { openid, session_key }
  } catch (error) {
    throw new Error('微信API调用失败: ' + error.message)
  }
}

/**
 * 解密微信运动数据
 */
function decryptWeRunData(encryptedData, iv, sessionKey) {
  try {
    // Base64解码
    const encryptedDataBuffer = Buffer.from(encryptedData, 'base64')
    const sessionKeyBuffer = Buffer.from(sessionKey, 'base64')
    const ivBuffer = Buffer.from(iv, 'base64')

    // AES-128-CBC 解密
    const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKeyBuffer, ivBuffer)
    decipher.setAutoPadding(true)

    let decrypted = decipher.update(encryptedDataBuffer, 'binary', 'utf8')
    decrypted += decipher.final('utf8')

    // 解析JSON
    const data = JSON.parse(decrypted)
    return data
  } catch (error) {
    throw new Error('解密失败: ' + error.message)
  }
}

module.exports = {
  getOpenIdAndSessionKey,
  decryptWeRunData
}
