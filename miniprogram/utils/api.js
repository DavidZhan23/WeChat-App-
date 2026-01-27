// utils/api.js - API 请求封装
const app = getApp()

/**
 * 请求封装
 */
function request(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.serverUrl}${url}`,
      method: method,
      data: data,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.code === 0) {
            resolve(res.data.data)
          } else {
            wx.showToast({
              title: res.data.message || '请求失败',
              icon: 'none'
            })
            reject(res.data)
          }
        } else {
          reject(res)
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

/**
 * 获取用户信息
 */
function getUserInfo(openid) {
  return request('/api/user/info', 'GET', { openid })
}

/**
 * 更新用户信息（包括处室）
 */
function updateUserInfo(data) {
  return request('/api/user/update', 'POST', data)
}

/**
 * 获取步数数据（解密）
 */
function decryptSteps(encryptedData, iv) {
  const openid = wx.getStorageSync('openid')
  return request('/api/steps/decrypt', 'POST', {
    openid,
    encryptedData,
    iv
  })
}

/**
 * 上传步数
 */
function uploadSteps(steps, date) {
  const openid = wx.getStorageSync('openid')
  return request('/api/steps/upload', 'POST', {
    openid,
    steps,
    date
  })
}

/**
 * 获取个人步数统计
 */
function getPersonalStats(openid, startDate, endDate) {
  return request('/api/stats/personal', 'GET', {
    openid,
    startDate,
    endDate
  })
}

/**
 * 获取处室排行榜
 */
function getDepartmentRanking() {
  return request('/api/stats/department-ranking', 'GET')
}

/**
 * 获取处室详情
 */
function getDepartmentStats(department) {
  return request('/api/stats/department', 'GET', { department })
}

module.exports = {
  request,
  getUserInfo,
  updateUserInfo,
  decryptSteps,
  uploadSteps,
  getPersonalStats,
  getDepartmentRanking,
  getDepartmentStats
}
