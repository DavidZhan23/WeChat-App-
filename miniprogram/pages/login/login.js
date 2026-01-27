// pages/login/login.js
const app = getApp()
const api = require('../../utils/api')

Page({
  data: {
    departments: [],
    selectedDepartment: '',
    userInfo: null
  },

  onLoad() {
    this.setData({
      departments: app.globalData.departments
    })
    this.checkLogin()
  },

  // 检查是否已登录
  checkLogin() {
    const openid = wx.getStorageSync('openid')
    if (openid) {
      // 已登录，获取用户信息
      api.getUserInfo(openid).then(userInfo => {
        if (userInfo && userInfo.department) {
          // 已有处室信息，跳转到首页
          app.globalData.userInfo = userInfo
          wx.switchTab({
            url: '/pages/index/index'
          })
        } else {
          // 需要选择处室
          this.setData({ userInfo })
        }
      }).catch(() => {
        // 获取失败，重新登录
        this.login()
      })
    } else {
      // 未登录
      this.login()
    }
  },

  // 微信登录
  login() {
    wx.showLoading({ title: '登录中...' })
    app.login().then(() => {
      // 获取用户信息
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          this.setData({
            userInfo: res.userInfo
          })
          wx.hideLoading()
        },
        fail: () => {
          wx.hideLoading()
          wx.showToast({
            title: '需要授权才能使用',
            icon: 'none'
          })
        }
      })
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: err || '登录失败',
        icon: 'none'
      })
    })
  },

  // 选择处室
  onDepartmentChange(e) {
    this.setData({
      selectedDepartment: e.detail.value
    })
  },

  // 确认并保存
  confirm() {
    if (!this.data.selectedDepartment) {
      wx.showToast({
        title: '请选择处室',
        icon: 'none'
      })
      return
    }

    wx.showLoading({ title: '保存中...' })
    const openid = wx.getStorageSync('openid')
    api.updateUserInfo({
      openid,
      nickname: this.data.userInfo?.nickName || '用户',
      avatar: this.data.userInfo?.avatarUrl || '',
      department: this.data.selectedDepartment
    }).then(() => {
      wx.hideLoading()
      app.globalData.userInfo = {
        ...this.data.userInfo,
        department: this.data.selectedDepartment
      }
      wx.switchTab({
        url: '/pages/index/index'
      })
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: err || '保存失败',
        icon: 'none'
      })
    })
  }
})
