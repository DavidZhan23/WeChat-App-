// server/config/database.js - 数据库配置
const mysql = require('mysql2/promise')

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'longmarch',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}

// 创建连接池
const pool = mysql.createPool(dbConfig)

// 测试连接
pool.getConnection()
  .then(connection => {
    console.log('数据库连接成功')
    connection.release()
  })
  .catch(err => {
    console.error('数据库连接失败:', err)
  })

module.exports = pool
