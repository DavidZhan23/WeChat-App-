// server/routes/steps.js - 步数路由
const express = require('express')
const router = express.Router()
const { decryptWeRunData } = require('../utils/wechat')
const { getUserByOpenId } = require('../models/user')
const { saveStepsRecord } = require('../models/steps')
const { getSession } = require('../models/session')

/**
 * 解密微信运动数据
 * POST /api/steps/decrypt
 */
router.post('/decrypt', async (req, res) => {
  try {
    const { openid, encryptedData, iv } = req.body

    if (!openid || !encryptedData || !iv) {
      return res.json({
        code: -1,
        message: '缺少必要参数',
        data: null
      })
    }

    // 从数据库获取 session_key
    const sessionKey = await getSession(openid)

    if (!sessionKey) {
      return res.json({
        code: -1,
        message: 'session_key不存在，请重新登录',
        data: null
      })
    }

    // 解密数据
    const decryptedData = decryptWeRunData(encryptedData, iv, sessionKey)

    res.json({
      code: 0,
      message: '解密成功',
      data: decryptedData
    })
  } catch (error) {
    console.error('Decrypt steps error:', error)
    res.json({
      code: -1,
      message: error.message || '解密失败',
      data: null
    })
  }
})

/**
 * 上传步数
 * POST /api/steps/upload
 */
router.post('/upload', async (req, res) => {
  try {
    const { openid, steps, date } = req.body

    if (!openid || steps === undefined || !date) {
      return res.json({
        code: -1,
        message: '缺少必要参数',
        data: null
      })
    }

    // 获取用户ID
    const user = await getUserByOpenId(openid)
    if (!user) {
      return res.json({
        code: -1,
        message: '用户不存在',
        data: null
      })
    }

    // 保存步数记录
    await saveStepsRecord(user.id, parseInt(steps), date)

    res.json({
      code: 0,
      message: '上传成功',
      data: {
        steps: parseInt(steps),
        date
      }
    })
  } catch (error) {
    console.error('Upload steps error:', error)
    res.json({
      code: -1,
      message: error.message || '上传失败',
      data: null
    })
  }
})

module.exports = router
