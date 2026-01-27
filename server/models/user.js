// server/models/user.js - 用户模型
const db = require('../config/database')

/**
 * 根据 openid 获取用户信息
 */
async function getUserByOpenId(openid) {
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE openid = ?',
    [openid]
  )
  return rows[0] || null
}

/**
 * 创建用户
 */
async function createUser(userData) {
  const { openid, nickname, avatar, department } = userData
  const [result] = await db.execute(
    `INSERT INTO users (openid, nickname, avatar, department, created_at) 
     VALUES (?, ?, ?, ?, NOW())`,
    [openid, nickname || '用户', avatar || '', department || '']
  )
  return result.insertId
}

/**
 * 更新用户信息
 */
async function updateUser(openid, userData) {
  const { nickname, avatar, department } = userData
  const updates = []
  const values = []

  if (nickname !== undefined) {
    updates.push('nickname = ?')
    values.push(nickname)
  }
  if (avatar !== undefined) {
    updates.push('avatar = ?')
    values.push(avatar)
  }
  if (department !== undefined) {
    updates.push('department = ?')
    values.push(department)
  }

  if (updates.length === 0) {
    return false
  }

  values.push(openid)
  const [result] = await db.execute(
    `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE openid = ?`,
    values
  )
  return result.affectedRows > 0
}

module.exports = {
  getUserByOpenId,
  createUser,
  updateUser
}
