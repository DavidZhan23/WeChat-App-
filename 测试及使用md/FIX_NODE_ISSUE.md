# 修复 Node.js 依赖库问题

## 问题说明
你的 Node.js 22.7.0 需要 `libicui18n.74.dylib`，但系统只有 `icu4c@78` 版本。

## 解决方案（选择其中一个）

### 方案一：创建符号链接（快速修复，推荐）

在终端中执行以下命令（需要输入你的 Mac 密码）：

```bash
# 创建目录（如果不存在）
sudo mkdir -p /opt/homebrew/opt/icu4c/lib

# 创建符号链接
sudo ln -sf /opt/homebrew/Cellar/icu4c@78/78.2/lib/libicui18n.78.dylib /opt/homebrew/opt/icu4c/lib/libicui18n.74.dylib
```

然后测试：
```bash
cd /Users/davidzhan/Desktop/重走长征路小程序/server
npm run dev
```

### 方案二：使用 nvm 安装兼容的 Node.js 版本（更稳定）

1. **安装 nvm**（如果还没安装）：
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

2. **重新加载 shell 配置**：
```bash
source ~/.zshrc
```

3. **安装 Node.js 20 LTS（推荐，更稳定）**：
```bash
nvm install 20
nvm use 20
nvm alias default 20
```

4. **验证版本**：
```bash
node -v
npm -v
```

5. **重新安装项目依赖**：
```bash
cd /Users/davidzhan/Desktop/重走长征路小程序/server
rm -rf node_modules
npm install
npm run dev
```

### 方案三：重新安装 Node.js（如果方案一不行）

```bash
# 卸载当前 Node.js
brew uninstall node

# 重新安装（需要网络连接）
brew install node

# 如果网络有问题，可以尝试：
brew reinstall --force node
```

## 数据库配置检查

你的 `.env` 文件已经配置好了：
- DB_HOST=localhost ✅
- DB_USER=root ✅
- DB_PASSWORD=13359413602Zqy ✅
- DB_NAME=longmarch ✅

**下一步：确保数据库已初始化**

在终端执行：
```bash
mysql -u root -p13359413602Zqy < /Users/davidzhan/Desktop/重走长征路小程序/database/init.sql
```

或者：
```bash
mysql -u root -p
# 输入密码：13359413602Zqy
# 然后执行：
source /Users/davidzhan/Desktop/重走长征路小程序/database/init.sql;
exit;
```

## 测试步骤

1. **修复 Node.js 问题**（使用上面的方案一或二）
2. **初始化数据库**（如果还没做）
3. **启动后端**：
```bash
cd /Users/davidzhan/Desktop/重走长征路小程序/server
npm run dev
```

4. **测试接口**（新开一个终端）：
```bash
curl http://localhost:3000/health
```

应该返回：`{"status":"ok","message":"服务运行正常"}`
