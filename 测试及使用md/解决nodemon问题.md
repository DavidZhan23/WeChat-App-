# 解决 nodemon 问题

## 问题
运行 `npm run dev` 时出现：`sh: nodemon: command not found`

## 原因
`nodemon` 是开发依赖，需要先安装。但由于网络问题，`npm install` 可能无法完成。

## 解决方案

### 方案一：安装所有依赖（推荐，如果网络正常）

在终端执行：

```bash
cd /Users/davidzhan/Desktop/重走长征路小程序/server
npm install
```

**如果网络很慢或超时**，可以尝试：

```bash
# 使用国内镜像（更快）
npm install --registry=https://registry.npmmirror.com

# 或者使用 cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install
```

### 方案二：我已经修改了启动脚本（临时方案）

我已经把 `package.json` 中的 `dev` 脚本从 `nodemon app.js` 改成了 `node app.js`。

**现在你可以直接运行**：

```bash
cd /Users/davidzhan/Desktop/重走长征路小程序/server
npm run dev
```

**但是**，你仍然需要先安装基础依赖（express、mysql2 等），否则会报其他错误。

### 方案三：手动安装核心依赖

如果 `npm install` 一直失败，可以逐个安装核心依赖：

```bash
cd /Users/davidzhan/Desktop/重走长征路小程序/server

# 安装核心依赖
npm install express --save
npm install mysql2 --save
npm install cors --save
npm install dotenv --save
npm install axios --save
```

**注意**：`crypto` 是 Node.js 内置模块，不需要安装。

## 推荐步骤

1. **先尝试安装所有依赖**：
```bash
cd /Users/davidzhan/Desktop/重走长征路小程序/server
npm install
```

2. **如果安装成功，直接运行**：
```bash
npm run dev
```

3. **如果安装失败（网络问题），使用国内镜像**：
```bash
npm install --registry=https://registry.npmmirror.com
npm run dev
```

4. **如果还是不行，手动安装核心依赖**（见方案三）

## 验证安装

安装完成后，检查 `node_modules` 目录：

```bash
ls -la node_modules | head -10
```

应该能看到 `express`、`mysql2` 等文件夹。

## 下一步

安装完依赖后，确保：
1. ✅ MySQL 服务已启动
2. ✅ 数据库已初始化
3. ✅ 依赖已安装
4. ✅ 运行 `npm run dev` 启动服务
