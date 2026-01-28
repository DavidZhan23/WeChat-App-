#!/bin/bash
# 服务器部署脚本
# 使用方法：bash deploy.sh

echo "=== 重走长征路小程序后端部署脚本 ==="

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "错误: Node.js 未安装，请先安装 Node.js"
    exit 1
fi

echo "✓ Node.js 版本: $(node -v)"

# 检查 MySQL
if ! command -v mysql &> /dev/null; then
    echo "错误: MySQL 未安装，请先安装 MySQL"
    exit 1
fi

echo "✓ MySQL 已安装"

# 检查 .env 文件
if [ ! -f .env ]; then
    echo "警告: .env 文件不存在，从 .env.example 复制"
    cp .env.example .env
    echo "请编辑 .env 文件，填入正确的配置信息"
    exit 1
fi

echo "✓ 环境变量文件已配置"

# 安装依赖
echo "正在安装依赖..."
npm install --production

if [ $? -ne 0 ]; then
    echo "错误: 依赖安装失败"
    exit 1
fi

echo "✓ 依赖安装完成"

# 检查 PM2
if ! command -v pm2 &> /dev/null; then
    echo "正在安装 PM2..."
    npm install -g pm2
fi

echo "✓ PM2 已安装"

# 停止旧服务（如果存在）
pm2 stop longmarch-server 2>/dev/null
pm2 delete longmarch-server 2>/dev/null

# 启动服务
echo "正在启动服务..."
pm2 start app.js --name longmarch-server

if [ $? -ne 0 ]; then
    echo "错误: 服务启动失败"
    exit 1
fi

echo "✓ 服务启动成功"

# 设置开机自启
pm2 startup
pm2 save

echo ""
echo "=== 部署完成 ==="
echo "服务状态:"
pm2 status

echo ""
echo "查看日志: pm2 logs longmarch-server"
echo "重启服务: pm2 restart longmarch-server"
echo "停止服务: pm2 stop longmarch-server"
