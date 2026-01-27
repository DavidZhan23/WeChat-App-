// pages/map/map.js
const app = getApp()
const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    totalDistance: 0,
    progressPercent: 0,
    currentLocation: '',
    locations: [],
    userLocation: null
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.loadData()
  },

  // 加载数据
  loadData() {
    const openid = wx.getStorageSync('openid')
    if (!openid) return

    // 获取个人总里程
    api.getPersonalStats(openid, '2020-01-01', util.getToday()).then(stats => {
      const distance = stats.totalDistance || 0
      const percent = util.distanceToPercent(distance)
      
      // 计算当前位置
      const locations = util.getLongMarchLocations()
      let currentLocation = locations[0].name
      for (let i = locations.length - 1; i >= 0; i--) {
        if (distance >= locations[i].distance) {
          currentLocation = locations[i].name
          break
        }
      }

      // 计算下一个目标点
      const nextLocation = locations.find(loc => loc.distance > distance) || locations[locations.length - 1]
      const remainingDistance = nextLocation.distance - distance

      this.setData({
        totalDistance: distance,
        progressPercent: percent,
        currentLocation: currentLocation,
        nextLocation: nextLocation.name,
        remainingDistance: remainingDistance.toFixed(2),
        locations: locations,
        userLocation: {
          distance: distance,
          percent: percent
        }
      })
    }).catch(() => {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    })
  },

  // 获取处室总里程
  loadDepartmentData() {
    const userInfo = app.globalData.userInfo
    if (!userInfo || !userInfo.department) return

    api.getDepartmentStats(userInfo.department).then(stats => {
      const distance = stats.totalDistance || 0
      const percent = util.distanceToPercent(distance)
      
      this.setData({
        departmentDistance: distance,
        departmentProgress: percent
      })
    }).catch(() => {})
  }
})
