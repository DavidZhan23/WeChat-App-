// server/models/stats.js - 统计模型
const db = require('../config/database')

/**
 * 获取处室排行榜
 */
async function getDepartmentRanking() {
  const [rows] = await db.execute(
    `SELECT 
      u.department,
      COALESCE(SUM(sr.steps), 0) as total_steps,
      COUNT(DISTINCT u.id) as member_count
     FROM users u
     LEFT JOIN steps_records sr ON u.id = sr.user_id
     WHERE u.department IS NOT NULL AND u.department != ''
     GROUP BY u.department
     ORDER BY total_steps DESC`
  )
  return rows.map(row => ({
    department: row.department,
    totalSteps: parseInt(row.total_steps) || 0,
    memberCount: row.member_count || 0
  }))
}

/**
 * 获取处室统计
 */
async function getDepartmentStats(department) {
  const [rows] = await db.execute(
    `SELECT 
      COALESCE(SUM(sr.steps), 0) as total_steps,
      COUNT(DISTINCT sr.date) as total_days,
      COUNT(DISTINCT u.id) as member_count
     FROM users u
     LEFT JOIN steps_records sr ON u.id = sr.user_id
     WHERE u.department = ?`,
    [department]
  )
  
  const row = rows[0] || {}
  return {
    department,
    totalSteps: parseInt(row.total_steps) || 0,
    totalDays: row.total_days || 0,
    memberCount: row.member_count || 0
  }
}

module.exports = {
  getDepartmentRanking,
  getDepartmentStats
}
