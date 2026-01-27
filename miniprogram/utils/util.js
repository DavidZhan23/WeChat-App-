// utils/util.js - 工具函数

/**
 * 格式化日期
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
}

/**
 * 获取今天日期
 */
function getToday() {
  return formatDate(new Date())
}

/**
 * 获取本周日期范围
 */
function getWeekRange() {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1) // 周一
  const monday = new Date(today.setDate(diff))
  const sunday = new Date(today.setDate(diff + 6))
  
  return {
    start: formatDate(monday),
    end: formatDate(sunday)
  }
}

/**
 * 步数转里程（公里）
 * 1步 ≈ 0.0007公里
 */
function stepsToDistance(steps) {
  return (steps * 0.0007).toFixed(2)
}

/**
 * 里程转百分比（基于长征路25000公里）
 */
function distanceToPercent(distance) {
  const totalDistance = 25000 // 长征路总里程
  const percent = (distance / totalDistance * 100).toFixed(2)
  return Math.min(percent, 100) // 最多100%
}

/**
 * 格式化数字（添加千分位）
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 获取长征路关键地点
 */
function getLongMarchLocations() {
  return [
    { name: '瑞金', distance: 0 },
    { name: '湘江', distance: 500 },
    { name: '遵义', distance: 2000 },
    { name: '赤水', distance: 3000 },
    { name: '金沙江', distance: 5000 },
    { name: '大渡河', distance: 7000 },
    { name: '泸定桥', distance: 7500 },
    { name: '雪山', distance: 10000 },
    { name: '草地', distance: 15000 },
    { name: '会宁', distance: 25000 }
  ]
}

module.exports = {
  formatDate,
  getToday,
  getWeekRange,
  stepsToDistance,
  distanceToPercent,
  formatNumber,
  getLongMarchLocations
}
