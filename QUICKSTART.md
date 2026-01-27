# 快速开始指南

## 第一步：准备工作

### 1.1 注册微信小程序
1. 访问 https://mp.weixin.qq.com
2. 注册小程序账号（需要企业或组织认证）
3. 获取 **AppID** 和 **AppSecret**
4. 记录这些信息，后续需要用到

### 1.2 准备服务器
- 需要一台云服务器（腾讯云/阿里云）
- 需要已备案的域名（用于HTTPS）
- 服务器需要安装 Node.js 和 MySQL

## 第二步：数据库初始化

### 2.1 登录MySQL
```bash
mysql -u root -p
```

### 2.2 执行初始化脚本
```sql
source /path/to/重走长征路小程序/database/init.sql
```

## 第三步：配置后端服务

### 3.1 安装依赖
```bash
cd server
npm install
```

### 3.2 配置环境变量
```bash
# 复制示例文件
cp .env.example .env

# 编辑 .env 文件，填入以下信息：
# WECHAT_APPID=你的AppID
# WECHAT_APPSECRET=你的AppSecret
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=你的数据库密码
# DB_NAME=longmarch
```

### 3.3 启动服务（开发环境）
```bash
npm run dev
```

服务将在 http://localhost:3000 运行

## 第四步：配置小程序

### 4.1 使用微信开发者工具
1. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开工具，选择"导入项目"
3. 选择 `miniprogram` 目录
4. 填入你的 AppID

### 4.2 修改服务器地址
打开 `miniprogram/app.js`，修改：
```javascript
serverUrl: 'https://your-domain.com'  // 改为你的服务器地址
```

**注意**：开发阶段可以使用内网穿透工具（如 ngrok）来测试

### 4.3 准备图片资源
根据 `IMAGES_README.md` 的说明，准备所需的图片资源并放入 `miniprogram/images/` 目录

## 第五步：测试运行

### 5.1 测试后端API
```bash
# 健康检查
curl http://localhost:3000/health
```

### 5.2 测试小程序
1. 在微信开发者工具中点击"编译"
2. 测试登录功能
3. 测试步数同步功能

## 第六步：部署上线

### 6.1 部署后端服务
参考 `DEPLOYMENT.md` 详细部署指南

### 6.2 配置小程序域名
1. 登录微信公众平台
2. 进入"开发" -> "开发管理" -> "开发设置"
3. 配置服务器域名

### 6.3 提交审核
1. 在微信开发者工具中点击"上传"
2. 登录微信公众平台提交审核
3. 等待审核通过后发布

## 常见问题

### Q: 如何获取微信运动数据？
A: 用户需要：
1. 在微信中开启"微信运动"
2. 在小程序中授权"获取微信运动数据"
3. 点击"同步步数"按钮

### Q: 开发阶段如何测试？
A: 可以使用：
1. 内网穿透工具（ngrok、natapp）
2. 本地测试服务器
3. 微信开发者工具的"不校验合法域名"选项（仅开发使用）

### Q: session_key 存储在哪里？
A: 当前实现存储在MySQL的 `user_sessions` 表中。生产环境建议使用Redis存储以提高性能。

### Q: 如何添加更多处室？
A: 可以在数据库的 `departments` 表中添加，或在小程序的 `app.js` 中修改 `departments` 数组。

## 下一步

- 阅读完整的 `README.md` 了解项目结构
- 查看 `DEPLOYMENT.md` 了解部署细节
- 根据需要自定义功能和样式

## 技术支持

如遇到问题，请检查：
1. 服务器日志：`pm2 logs`
2. 数据库连接是否正常
3. 微信API配置是否正确
4. 网络连接和域名解析
