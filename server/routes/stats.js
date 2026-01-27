// server/routes/stats.js - 统计路由
const express = require('express')
const router = express.Router()
const { getUserByOpenId } = require('../models/user')
const { getStepsRecords, getTotalSteps } = require('../models/steps')
const { getDepartmentRanking, getDepartmentStats } = require('../models/stats')

// 步数转里程（公里）
function stepsToDistance(steps) {
  return (steps * 0.0007).toFixed(2)
}

/**
 * 获取个人统计
 * GET /api/stats/personal
 */
router.get('/personal', async (req, res) => {
  try {
    const { openid, startDate, endDate } = req.query

    if (!openid) {
      return res.json({
        code: -1,
        message: '缺少openid参数',
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

    const start = startDate || '2020-01-01'
    const end = endDate || new Date().toISOString().split('T')[0]

    // 获取总步数和天数
    const { totalSteps, totalDays } = await getTotalSteps(user.id, start, end)
    const totalDistance = parseFloat(stepsToDistance(totalSteps))

    // 获取每日记录
    const records = await getStepsRecords(user.id, start, end)
    const dailyRecords = records.map(record => ({
      date: record.date,
      steps: record.steps,
      distance: parseFloat(stepsToDistance(record.steps))
    }))

    res.json({
      code: 0,
      message: '获取成功',
      data: {
        totalSteps,
        totalDistance,
        totalDays,
        dailyRecords
      }
    })
  } catch (error) {
    console.error('Get personal stats error:', error)
    res.json({
      code: -1,
      message: error.message || '获取统计失败',
      data: null
    })
  }
})

/**
 * 获取处室排行榜
 * GET /api/stats/department-ranking
 */
router.get('/department-ranking', async (req, res) => {
  try {
    const ranking = await getDepartmentRanking()

    // 添加里程信息
    const rankingWithDistance = ranking.map(item => ({
      ...item,
      totalDistance: parseFloat(stepsToDistance(item.totalSteps))
    }))

    res.json({
      code: 0,
      message: '获取成功',
      data: rankingWithDistance
    })
  } catch (error) {
    console.error('Get department ranking error:', error)
    res.json({
      code: -1,
      message: error.message || '获取排行榜失败',
      data: null
    })
  }
})

/**
 * 获取处室统计
 * GET /api/stats/department
 */
router.get('/department', async (req, res) => {
  try {
    const { department } = req.query

    if (!department) {
      return res.json({
        code: -1,
        message: '缺少department参数',
        data: null
      })
    }

    const stats = await getDepartmentStats(department)
    const totalDistance = parseFloat(stepsToDistance(stats.totalSteps))

    res.json({
      code: 0,
      message: '获取成功',
      data: {
        ...stats,
        totalDistance
      }
    })
  } catch (error) {
    console.error('Get department stats error:', error)
    res.json({
      code: -1,
      message: error.message || '获取处室统计失败',
      data: null
    })
  }
})

module.exports = router
