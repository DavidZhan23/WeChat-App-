// app.js
App({
  onLaunch() {
    // 检查登录状态
    this.checkLogin()
  },

  globalData: {
    userInfo: null,
    openid: null,
    serverUrl: 'https://your-server.com', // 替换为实际服务器地址
    departments: [
      '办公室',
      '人事处',
      '财务处',
      '业务处',
      '技术处',
      '后勤处'
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
    wx.request({
      url: `${this.globalData.serverUrl}/api/user/info`,
      method: 'GET',
      data: {
        openid: this.globalData.openid
      },
      success(res) {
        if (res.data.code === 0) {
          that.globalData.userInfo = res.data.data
        }
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
                if (loginRes.data.code === 0) {
                  const { openid, session_key } = loginRes.data.data
                  this.globalData.openid = openid
                  wx.setStorageSync('openid', openid)
                  wx.setStorageSync('session_key', session_key)
                  resolve({ openid, session_key })
                } else {
                  reject(loginRes.data.message)
                }
              },
              fail: reject
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
