// server/models/session.js - Session管理模型
// 注意：生产环境建议使用Redis存储session_key

const db = require('../config/database')

/**
 * 保存session_key
 */
async function saveSession(openid, sessionKey) {
  // 检查是否已存在
  const [existing] = await db.execute(
    'SELECT id FROM user_sessions WHERE openid = ?',
    [openid]
  )

  if (existing.length > 0) {
    // 更新
    await db.execute(
      'UPDATE user_sessions SET session_key = ?, updated_at = NOW() WHERE openid = ?',
      [sessionKey, openid]
    )
  } else {
    // 插入
    await db.execute(
      'INSERT INTO user_sessions (openid, session_key, created_at) VALUES (?, ?, NOW())',
      [openid, sessionKey]
    )
  }
}

/**
 * 获取session_key
 */
async function getSession(openid) {
  const [rows] = await db.execute(
    'SELECT session_key FROM user_sessions WHERE openid = ?',
    [openid]
  )
  return rows[0]?.session_key || null
}

/**
 * 删除session_key
 */
async function deleteSession(openid) {
  await db.execute(
    'DELETE FROM user_sessions WHERE openid = ?',
    [openid]
  )
}

module.exports = {
  saveSession,
  getSession,
  deleteSession
}
