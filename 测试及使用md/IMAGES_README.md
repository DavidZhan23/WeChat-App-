# 图片资源说明

小程序需要以下图片资源，请放置在 `miniprogram/images/` 目录下：

## TabBar 图标（需要2套：普通和选中状态）

1. **home.png / home-active.png** - 首页图标
2. **ranking.png / ranking-active.png** - 排行榜图标
3. **map.png / map-active.png** - 长征路图标
4. **profile.png / profile-active.png** - 我的图标

## 其他图片

5. **longmarch-logo.png** - 登录页Logo（建议 200x200px）
6. **default-avatar.png** - 默认头像（建议 120x120px）
7. **medal-gold.png** - 金牌图标（排行榜第1名，建议 60x60px）
8. **medal-silver.png** - 银牌图标（排行榜第2名，建议 60x60px）
9. **medal-bronze.png** - 铜牌图标（排行榜第3名，建议 60x60px）

## 图标设计建议

- **尺寸**：TabBar图标建议 81x81px（@2x），实际使用 40x40px
- **格式**：PNG格式，支持透明背景
- **风格**：简洁、现代，符合长征主题的红色调
- **颜色**：
  - 未选中：#7A7E83（灰色）
  - 选中：#d32f2f（红色）

## 获取图标资源

1. 使用图标库（推荐）：
   - [IconFont](https://www.iconfont.cn/)
   - [Icons8](https://icons8.com/)
   - [Flaticon](https://www.flaticon.com/)

2. 自行设计：
   - 使用 Figma、Sketch 等设计工具
   - 导出为PNG格式

3. 临时方案：
   - 可以使用文字或emoji临时替代
   - 后续再替换为正式图标

## 图片优化

- 使用工具压缩图片：TinyPNG、ImageOptim
- 确保图片大小合理，避免影响加载速度
