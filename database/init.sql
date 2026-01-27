-- database/init.sql - 数据库初始化脚本

-- 创建数据库
CREATE DATABASE IF NOT EXISTS longmarch DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE longmarch;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  openid VARCHAR(100) UNIQUE NOT NULL COMMENT '微信用户唯一标识',
  nickname VARCHAR(100) DEFAULT '用户' COMMENT '昵称',
  avatar VARCHAR(500) DEFAULT '' COMMENT '头像URL',
  department VARCHAR(50) DEFAULT '' COMMENT '处室名称',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_openid (openid),
  INDEX idx_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 步数记录表
CREATE TABLE IF NOT EXISTS steps_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL COMMENT '用户ID',
  steps INT NOT NULL DEFAULT 0 COMMENT '步数',
  date DATE NOT NULL COMMENT '日期',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY uk_user_date (user_id, date),
  INDEX idx_user_id (user_id),
  INDEX idx_date (date),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='步数记录表';

-- 处室表（可选，用于存储处室汇总信息）
CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL COMMENT '处室名称',
  description VARCHAR(200) DEFAULT '' COMMENT '处室描述',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='处室表';

-- Session表（存储session_key）
CREATE TABLE IF NOT EXISTS user_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  openid VARCHAR(100) UNIQUE NOT NULL COMMENT '微信用户唯一标识',
  session_key VARCHAR(200) NOT NULL COMMENT '会话密钥',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_openid (openid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户会话表';

-- 插入默认处室（可选）
INSERT INTO departments (name, description) VALUES
('办公室', '办公室'),
('人事处', '人事处'),
('财务处', '财务处'),
('业务处', '业务处'),
('技术处', '技术处'),
('后勤处', '后勤处')
ON DUPLICATE KEY UPDATE name=name;
