// app.js
const config = require('./config')

App({
  onLaunch() {
    // 输出调试信息
    console.log('=== 小程序启动 ===')
    console.log('服务器地址:', this.globalData.serverUrl)
    console.log('环境:', config.env)
    
    // 延迟检查登录状态，确保页面已注册
    setTimeout(() => {
      this.checkLogin()
    }, 100)
  },

  globalData: {
    userInfo: null,
    openid: null,
    serverUrl: config.serverUrl, // 从配置文件读取
    departments: [
      '业务一部',
      '业务二部',
      '业务三部',
      '业务四部',
      '业务五部',
      '业务六部',
      '业务七部',
      '业务八部'
    ]
  },

  // 检查登录状态
  checkLogin() {
    const openid = wx.getStorageSync('openid')
    if (openid) {
      this.globalData.openid = openid
      this.getUserInfo()
    }
  },

  // 获取用户信息
  getUserInfo() {
    const that = this
    const url = `${this.globalData.serverUrl}/api/user/info`
    console.log('请求用户信息:', url)
    
    wx.request({
      url: url,
      method: 'GET',
      data: {
        openid: this.globalData.openid
      },
      success(res) {
        console.log('用户信息响应:', res)
        if (res.data.code === 0) {
          that.globalData.userInfo = res.data.data
        }
      },
      fail(err) {
        console.error('获取用户信息失败:', err)
      }
    })
  },

  // 登录
  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            // 发送 code 到后端换取 openid
            wx.request({
              url: `${this.globalData.serverUrl}/api/auth/login`,
              method: 'POST',
              data: {
                code: res.code
              },
              success: (loginRes) => {
                console.log('登录响应:', loginRes)
                if (loginRes.data.code === 0) {
                  const { openid, session_key } = loginRes.data.data
                  this.globalData.openid = openid
                  wx.setStorageSync('openid', openid)
                  wx.setStorageSync('session_key', session_key)
                  resolve({ openid, session_key })
                } else {
                  console.error('登录失败:', loginRes.data.message)
                  reject(loginRes.data.message)
                }
              },
              fail: (err) => {
                console.error('登录请求失败:', err)
                reject(err)
              }
            })
          } else {
            reject('登录失败')
          }
        },
        fail: reject
      })
    })
  }
})
