// config.js - 环境配置
// 根据开发环境自动选择服务器地址

// 获取运行环境
function getEnv() {
  try {
    const systemInfo = wx.getSystemInfoSync()
    // 开发者工具中 platform 是 'devtools'
    // 真机中 platform 是 'ios' 或 'android'
    if (systemInfo.platform === 'devtools') {
      return 'development' // 模拟器环境
    } else {
      return 'testing' // 真机环境（包括预览和真机调试）
    }
  } catch (e) {
    // 如果获取失败，默认使用测试环境（真机）
    return 'testing'
  }
}

// 配置不同环境的服务器地址
const config = {
  // 开发环境：模拟器使用 localhost
  development: 'http://localhost:3000',
  
  // 测试环境：真机调试使用局域网 IP
  // 如果使用手机热点，请使用电脑在热点网络中的 IP
  // 获取方法：在终端执行 ifconfig | grep "inet " | grep -v 127.0.0.1
  // 常见热点 IP 范围：
  // - iPhone 热点：172.20.10.x
  // - Android 热点：192.168.43.x 或 192.168.137.x
  testing: 'http://172.20.10.5:3000', // ⚠️ 实际 IP（热点网络中的 IP）
  
  // 生产环境：正式服务器地址
  production: 'https://your-domain.com'
}

// 当前环境
const env = getEnv()

// 导出配置
module.exports = {
  serverUrl: config[env] || config.development,
  env: env
}
