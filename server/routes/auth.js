// server/routes/auth.js - 认证路由
const express = require('express')
const router = express.Router()
const { getOpenIdAndSessionKey } = require('../utils/wechat')
const { getUserByOpenId, createUser } = require('../models/user')
const { saveSession } = require('../models/session')

/**
 * 微信登录
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { code } = req.body

    if (!code) {
      return res.json({
        code: -1,
        message: '缺少code参数',
        data: null
      })
    }

    // 获取 openid 和 session_key
    const { openid, session_key } = await getOpenIdAndSessionKey(code)

    // 保存session_key到数据库
    await saveSession(openid, session_key)

    // 检查用户是否存在，不存在则创建
    let user = await getUserByOpenId(openid)
    if (!user) {
      const userId = await createUser({
        openid,
        nickname: '用户',
        avatar: '',
        department: ''
      })
      user = { id: userId, openid, nickname: '用户', avatar: '', department: '' }
    }

    res.json({
      code: 0,
      message: '登录成功',
      data: {
        openid,
        user
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.json({
      code: -1,
      message: error.message || '登录失败',
      data: null
    })
  }
})

module.exports = router
