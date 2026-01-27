// pages/profile/profile.js
const app = getApp()
const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    userInfo: null,
    stats: {
      totalSteps: 0,
      totalDistance: 0,
      totalDays: 0,
      avgSteps: 0
    },
    recentRecords: []
  },

  onLoad() {
    this.checkAuth()
  },

  onShow() {
    this.loadData()
  },

  // 检查授权
  checkAuth() {
    const openid = wx.getStorageSync('openid')
    if (!openid || !app.globalData.userInfo) {
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return
    }
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  // 加载数据
  loadData() {
    const openid = wx.getStorageSync('openid')
    if (!openid) return

    // 获取统计信息
    api.getPersonalStats(openid, '2020-01-01', util.getToday()).then(stats => {
      const totalSteps = stats.totalSteps || 0
      const totalDistance = stats.totalDistance || 0
      const totalDays = stats.totalDays || 0
      const avgSteps = totalDays > 0 ? Math.round(totalSteps / totalDays) : 0

      this.setData({
        stats: {
          totalSteps,
          totalDistance,
          totalDays,
          avgSteps
        }
      })
    }).catch(() => {})

    // 获取最近记录
    this.loadRecentRecords(openid)
  },

  // 加载最近记录
  loadRecentRecords(openid) {
    const endDate = util.getToday()
    const startDate = util.formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    
    api.getPersonalStats(openid, startDate, endDate).then(stats => {
      // 这里应该返回每日详细记录，暂时用汇总数据
      this.setData({
        recentRecords: stats.dailyRecords || []
      })
    }).catch(() => {})
  },

  // 同步步数
  syncSteps() {
    wx.showLoading({ title: '同步中...' })
    
    wx.getWeRunData({
      success: (res) => {
        if (res.encryptedData && res.iv) {
          api.decryptSteps(res.encryptedData, res.iv).then(data => {
            const today = util.getToday()
            const steps = data.stepInfoList[data.stepInfoList.length - 1]?.step || 0
            return api.uploadSteps(steps, today)
          }).then(() => {
            wx.hideLoading()
            wx.showToast({
              title: '同步成功',
              icon: 'success'
            })
            this.loadData()
          }).catch(err => {
            wx.hideLoading()
            wx.showToast({
              title: err || '同步失败',
              icon: 'none'
            })
          })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          title: '获取步数失败',
          icon: 'none'
        })
      }
    })
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('openid')
          wx.removeStorageSync('session_key')
          app.globalData.userInfo = null
          app.globalData.openid = null
          wx.redirectTo({
            url: '/pages/login/login'
          })
        }
      }
    })
  }
})
