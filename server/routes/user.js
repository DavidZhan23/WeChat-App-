// server/routes/user.js - 用户路由
const express = require('express')
const router = express.Router()
const { getUserByOpenId, updateUser } = require('../models/user')

/**
 * 获取用户信息
 * GET /api/user/info
 */
router.get('/info', async (req, res) => {
  try {
    const { openid } = req.query

    if (!openid) {
      return res.json({
        code: -1,
        message: '缺少openid参数',
        data: null
      })
    }

    const user = await getUserByOpenId(openid)

    if (!user) {
      return res.json({
        code: -1,
        message: '用户不存在',
        data: null
      })
    }

    res.json({
      code: 0,
      message: '获取成功',
      data: {
        id: user.id,
        openid: user.openid,
        nickname: user.nickname,
        avatar: user.avatar,
        department: user.department
      }
    })
  } catch (error) {
    console.error('Get user info error:', error)
    res.json({
      code: -1,
      message: error.message || '获取用户信息失败',
      data: null
    })
  }
})

/**
 * 更新用户信息
 * POST /api/user/update
 */
router.post('/update', async (req, res) => {
  try {
    const { openid, nickname, avatar, department } = req.body

    if (!openid) {
      return res.json({
        code: -1,
        message: '缺少openid参数',
        data: null
      })
    }

    const success = await updateUser(openid, {
      nickname,
      avatar,
      department
    })

    if (success) {
      const user = await getUserByOpenId(openid)
      res.json({
        code: 0,
        message: '更新成功',
        data: user
      })
    } else {
      res.json({
        code: -1,
        message: '更新失败',
        data: null
      })
    }
  } catch (error) {
    console.error('Update user error:', error)
    res.json({
      code: -1,
      message: error.message || '更新用户信息失败',
      data: null
    })
  }
})

module.exports = router
