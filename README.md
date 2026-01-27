# 重走长征路小程序

一个基于微信小程序开发的步数统计和长征路进度可视化应用。

## 功能特点

- ✅ 微信运动数据同步
- ✅ 个人步数统计
- ✅ 处室排行榜
- ✅ 长征路进度可视化
- ✅ 里程计算和进度展示

## 项目结构

```
重走长征路小程序/
├── miniprogram/          # 小程序前端
│   ├── pages/           # 页面
│   ├── utils/           # 工具函数
│   ├── app.js           # 小程序入口
│   └── app.json         # 小程序配置
├── server/              # 后端服务
│   ├── routes/          # 路由
│   ├── models/          # 数据模型
│   ├── utils/           # 工具函数
│   └── app.js           # 服务器入口
└── database/            # 数据库脚本
    └── init.sql         # 初始化SQL
```

## 快速开始

### 1. 环境准备

#### 微信小程序
1. 访问 [微信公众平台](https://mp.weixin.qq.com) 注册小程序账号
2. 获取 AppID 和 AppSecret
3. 配置服务器域名（需要HTTPS和备案域名）

#### 后端服务
1. 安装 Node.js (>= 14.0.0)
2. 安装 MySQL (>= 5.7)
3. 配置数据库

### 2. 数据库初始化

```bash
# 登录MySQL
mysql -u root -p

# 执行初始化脚本
source database/init.sql
```

### 3. 后端服务配置

```bash
cd server

# 安装依赖
npm install

# 复制环境变量文件
cp .env.example .env

# 编辑 .env 文件，填入配置信息
# WECHAT_APPID=你的AppID
# WECHAT_APPSECRET=你的AppSecret
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=你的数据库密码
# DB_NAME=longmarch
```

### 4. 启动后端服务

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

### 5. 小程序配置

1. 使用微信开发者工具打开 `miniprogram` 目录
2. 在 `miniprogram/app.js` 中修改 `serverUrl` 为你的服务器地址
3. 配置 AppID

### 6. 部署说明

#### 后端部署
- 推荐使用云服务器（腾讯云/阿里云）
- 需要HTTPS证书（可使用Let's Encrypt免费证书）
- 配置域名解析
- 使用 PM2 管理进程：`pm2 start app.js`

#### 小程序发布
1. 在微信开发者工具中点击"上传"
2. 登录微信公众平台提交审核
3. 审核通过后发布

## API 接口说明

### 认证接口
- `POST /api/auth/login` - 微信登录

### 用户接口
- `GET /api/user/info` - 获取用户信息
- `POST /api/user/update` - 更新用户信息

### 步数接口
- `POST /api/steps/decrypt` - 解密微信运动数据
- `POST /api/steps/upload` - 上传步数

### 统计接口
- `GET /api/stats/personal` - 获取个人统计
- `GET /api/stats/department-ranking` - 获取处室排行榜
- `GET /api/stats/department` - 获取处室统计

## 注意事项

1. **session_key 存储**：实际应用中，session_key 应该安全存储在服务器端（Redis/数据库），当前实现需要完善。

2. **数据安全**：
   - 所有API需要验证 openid
   - 敏感操作需要额外验证
   - 使用HTTPS传输

3. **性能优化**：
   - 大量用户时考虑缓存
   - 数据库查询优化
   - 使用CDN加速静态资源

4. **微信审核**：
   - 确保小程序符合微信审核规范
   - 明确告知用户数据使用目的
   - 提供隐私政策

## 开发计划

- [ ] 完善 session_key 存储机制
- [ ] 添加数据缓存
- [ ] 实现定时任务自动同步步数
- [ ] 添加更多可视化图表
- [ ] 支持手动输入步数（备选方案）
- [ ] 添加消息推送功能

## 技术支持

如有问题，请查看：
- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [微信运动API文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/werun/wx.getWeRunData.html)

## 许可证

ISC
# WeChat-App-
