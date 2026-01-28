// pages/ranking/ranking.js
const app = getApp()
const api = require('../../utils/api')
const util = require('../../utils/util')

Page({
  data: {
    ranking: [],
    loading: true,
    chartData: null
  },

  onLoad() {
    this.loadRanking()
  },

  onShow() {
    this.loadRanking()
  },

  onPullDownRefresh() {
    this.loadRanking().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  // 加载排行榜数据
  loadRanking() {
    wx.showLoading({ title: '加载中...' })
    return api.getDepartmentRanking().then(ranking => {
      // 计算里程
      const rankingWithDistance = ranking.map(item => {
        return Object.assign({}, item, {
          distance: parseFloat(util.stepsToDistance(item.totalSteps)),
          progress: util.distanceToPercent(parseFloat(util.stepsToDistance(item.totalSteps)))
        })
      })
      
      this.setData({
        ranking: rankingWithDistance,
        chartData: this.formatChartData(rankingWithDistance),
        loading: false
      })
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
      this.setData({ loading: false })
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    })
  },

  // 格式化图表数据
  formatChartData(ranking) {
    return {
      categories: ranking.map(item => item.department),
      series: [
        {
          name: '总步数',
          data: ranking.map(item => item.totalSteps)
        },
        {
          name: '总里程(公里)',
          data: ranking.map(item => item.distance)
        }
      ]
    }
  }
})
