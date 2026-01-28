// pages/index/index.js
const app = getApp()
const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    userInfo: null,
    todaySteps: 0,
    weekSteps: 0,
    todayDistance: 0,
    totalDistance: 0,
    progressPercent: 0,
    departmentRank: 0,
    departmentTotalSteps: 0,
    loading: true,
    todayDate: ''
  },

  onLoad() {
    this.setData({
      todayDate: util.getToday()
    })
    // 延迟检查，避免页面闪烁
    setTimeout(() => {
      this.checkAuth()
    }, 100)
  },

  onShow() {
    this.loadData()
  },

  // 检查授权
  checkAuth() {
    const openid = wx.getStorageSync('openid')
    if (!openid) {
      // 如果没有 openid，跳转到登录页
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return
    }
    
    // 如果有 openid 但没有用户信息，尝试获取
    if (!app.globalData.userInfo) {
      const api = require('../../utils/api')
      api.getUserInfo(openid).then(userInfo => {
        if (userInfo) {
          app.globalData.userInfo = userInfo
          this.setData({
            userInfo: userInfo
          })
          this.loadData()
        } else {
          // 用户不存在，跳转到登录页
          wx.redirectTo({
            url: '/pages/login/login'
          })
        }
      }).catch(() => {
        // 获取失败，跳转到登录页
        wx.redirectTo({
          url: '/pages/login/login'
        })
      })
    } else {
      // 已有用户信息，直接设置
      this.setData({
        userInfo: app.globalData.userInfo
      })
      this.loadData()
    }
  },

  // 加载数据
  loadData() {
    const openid = wx.getStorageSync('openid')
    if (!openid) return

    wx.showLoading({ title: '加载中...' })
    
    // 获取今日步数
    this.getTodaySteps(openid)
    
    // 获取本周统计
    const weekRange = util.getWeekRange()
    api.getPersonalStats(openid, weekRange.start, weekRange.end).then(stats => {
      this.setData({
        weekSteps: stats.totalSteps || 0,
        totalDistance: stats.totalDistance || 0,
        progressPercent: util.distanceToPercent(stats.totalDistance || 0)
      })
    }).catch(() => {})

    // 获取处室排名
    this.getDepartmentRanking(openid)
    
    wx.hideLoading()
    this.setData({ loading: false })
  },

  // 获取今日步数
  getTodaySteps(openid) {
    const today = util.getToday()
    api.getPersonalStats(openid, today, today).then(stats => {
      const steps = stats.totalSteps || 0
      this.setData({
        todaySteps: steps,
        todayDistance: util.stepsToDistance(steps)
      })
    }).catch(() => {})
  },

  // 获取处室排名
  getDepartmentRanking(openid) {
    api.getDepartmentRanking().then(ranking => {
      const userDept = app.globalData.userInfo?.department
      if (userDept) {
        const deptIndex = ranking.findIndex(item => item.department === userDept)
        if (deptIndex !== -1) {
          this.setData({
            departmentRank: deptIndex + 1,
            departmentTotalSteps: ranking[deptIndex].totalSteps || 0
          })
        }
      }
    }).catch(() => {})
  },

  // 同步步数
  syncSteps() {
    wx.showLoading({ title: '同步中...' })
    
    // 获取微信运动数据
    wx.getWeRunData({
      success: (res) => {
        if (res.encryptedData && res.iv) {
          // 发送到后端解密
          api.decryptSteps(res.encryptedData, res.iv).then(data => {
            // data 包含步数信息
            const today = util.getToday()
            const steps = data.stepInfoList[data.stepInfoList.length - 1]?.step || 0
            
            // 上传步数
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
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '未获取到步数数据',
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        wx.hideLoading()
        if (err.errMsg.includes('auth deny')) {
          wx.showModal({
            title: '提示',
            content: '需要授权微信运动数据才能同步步数',
            showCancel: false
          })
        } else {
          wx.showToast({
            title: '获取步数失败',
            icon: 'none'
          })
        }
      }
    })
  },

  // 跳转到排行榜
  goToRanking() {
    wx.switchTab({
      url: '/pages/ranking/ranking'
    })
  },

  // 跳转到长征路
  goToMap() {
    wx.switchTab({
      url: '/pages/map/map'
    })
  }
})
