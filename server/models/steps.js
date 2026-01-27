// server/models/steps.js - 步数模型
const db = require('../config/database')

/**
 * 保存步数记录
 */
async function saveStepsRecord(userId, steps, date) {
  // 检查是否已存在该日期的记录
  const [existing] = await db.execute(
    'SELECT id FROM steps_records WHERE user_id = ? AND date = ?',
    [userId, date]
  )

  if (existing.length > 0) {
    // 更新现有记录
    const [result] = await db.execute(
      'UPDATE steps_records SET steps = ?, updated_at = NOW() WHERE user_id = ? AND date = ?',
      [steps, userId, date]
    )
    return result.affectedRows > 0
  } else {
    // 插入新记录
    const [result] = await db.execute(
      'INSERT INTO steps_records (user_id, steps, date, created_at) VALUES (?, ?, ?, NOW())',
      [userId, steps, date]
    )
    return result.insertId
  }
}

/**
 * 获取用户指定日期范围的步数记录
 */
async function getStepsRecords(userId, startDate, endDate) {
  const [rows] = await db.execute(
    `SELECT * FROM steps_records 
     WHERE user_id = ? AND date BETWEEN ? AND ? 
     ORDER BY date DESC`,
    [userId, startDate, endDate]
  )
  return rows
}

/**
 * 获取用户今日步数
 */
async function getTodaySteps(userId) {
  const today = new Date().toISOString().split('T')[0]
  const [rows] = await db.execute(
    'SELECT steps FROM steps_records WHERE user_id = ? AND date = ?',
    [userId, today]
  )
  return rows[0]?.steps || 0
}

/**
 * 获取用户总步数
 */
async function getTotalSteps(userId, startDate, endDate) {
  const [rows] = await db.execute(
    `SELECT SUM(steps) as total_steps, COUNT(DISTINCT date) as total_days 
     FROM steps_records 
     WHERE user_id = ? AND date BETWEEN ? AND ?`,
    [userId, startDate, endDate]
  )
  return {
    totalSteps: rows[0]?.total_steps || 0,
    totalDays: rows[0]?.total_days || 0
  }
}

module.exports = {
  saveStepsRecord,
  getStepsRecords,
  getTodaySteps,
  getTotalSteps
}
