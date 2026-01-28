# 部署指南

## 一、服务器环境准备

### 1. 购买云服务器
- 推荐：腾讯云、阿里云
- 配置：最低 1核2G，推荐 2核4G
- 系统：Ubuntu 20.04 LTS 或 CentOS 7+

### 2. 安装必要软件

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js (使用 nvm 推荐)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 16
nvm use 16

# 安装 MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# 安装 Nginx
sudo apt install nginx -y

# 安装 PM2 (进程管理)
npm install -g pm2
```

## 二、数据库配置

### 1. 创建数据库

```bash
# 登录MySQL
sudo mysql -u root -p

# 执行初始化脚本
source /path/to/database/init.sql
```

### 2. 创建数据库用户（可选，推荐）

```sql
CREATE USER 'longmarch'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON longmarch.* TO 'longmarch'@'localhost';
FLUSH PRIVILEGES;
```

## 三、后端服务部署

### 1. 上传代码

```bash
# 使用 git 或 scp 上传代码到服务器
scp -r /path/to/重走长征路小程序 root@your-server-ip:/opt/
```

### 2. 安装依赖

```bash
cd /opt/重走长征路小程序/server
npm install --production
```

### 3. 配置环境变量

```bash
# 创建 .env 文件
cd /opt/重走长征路小程序/server
cp .env.example .env
nano .env

# 填入配置
WECHAT_APPID=你的AppID
WECHAT_APPSECRET=你的AppSecret
DB_HOST=localhost
DB_USER=longmarch
DB_PASSWORD=你的数据库密码
DB_NAME=longmarch
PORT=3000
NODE_ENV=production
```

### 4. 启动服务

```bash
# 使用 PM2 启动
cd /opt/重走长征路小程序/server
pm2 start app.js --name longmarch-server

# 设置开机自启
pm2 startup
pm2 save

# 查看状态
pm2 status
pm2 logs longmarch-server
```

## 四、Nginx 配置

### 1. 配置反向代理

```bash
sudo nano /etc/nginx/sites-available/longmarch
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL 证书配置
    ssl_certificate /path/to/your/cert.pem;
    ssl_certificate_key /path/to/your/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 反向代理到 Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. 启用配置

```bash
sudo ln -s /etc/nginx/sites-available/longmarch /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 五、SSL 证书配置

### 使用 Let's Encrypt 免费证书

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期（已自动配置）
sudo certbot renew --dry-run
```

## 六、微信小程序配置

### 1. 配置服务器域名

1. 登录 [微信公众平台](https://mp.weixin.qq.com)
2. 进入"开发" -> "开发管理" -> "开发设置"
3. 在"服务器域名"中添加：
   - request合法域名：`https://your-domain.com`
   - uploadFile合法域名：`https://your-domain.com`
   - downloadFile合法域名：`https://your-domain.com`

### 2. 修改小程序配置

在 `miniprogram/app.js` 中修改：

```javascript
serverUrl: 'https://your-domain.com'
```

## 七、防火墙配置

```bash
# Ubuntu/Debian
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# CentOS
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## 八、监控和维护

### 1. 查看日志

```bash
# PM2 日志
pm2 logs longmarch-server

# Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 2. 重启服务

```bash
# 重启后端服务
pm2 restart longmarch-server

# 重启 Nginx
sudo systemctl restart nginx
```

### 3. 更新代码

```bash
# 拉取最新代码
cd /opt/重走长征路小程序
git pull

# 安装新依赖
cd server
npm install --production

# 重启服务
pm2 restart longmarch-server
```

## 九、性能优化建议

1. **使用 Redis 缓存 session_key**（生产环境推荐）
2. **数据库连接池优化**
3. **启用 Nginx 缓存**
4. **使用 CDN 加速静态资源**
5. **定期备份数据库**

## 十、常见问题

### 1. 502 Bad Gateway
- 检查 Node.js 服务是否运行：`pm2 status`
- 检查端口是否正确：`netstat -tlnp | grep 3000`

### 2. 数据库连接失败
- 检查 MySQL 服务：`sudo systemctl status mysql`
- 检查数据库配置和权限

### 3. 微信API调用失败
- 检查 AppID 和 AppSecret 是否正确
- 检查服务器域名是否已配置

## 十一、安全建议

1. 定期更新系统和软件
2. 使用强密码
3. 限制 SSH 访问（使用密钥认证）
4. 定期备份数据
5. 监控服务器资源使用情况
