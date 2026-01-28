# 图片资源说明

## 当前状态

为了让你能快速测试小程序，我已经暂时移除了 TabBar 图标配置。现在小程序可以正常运行，只是底部导航栏只显示文字，没有图标。

## 如何添加图标（可选）

如果你想添加图标，可以：

### 方法一：使用在线图标库（推荐）

1. 访问 [IconFont](https://www.iconfont.cn/) 或 [Icons8](https://icons8.com/)
2. 搜索"首页"、"排行榜"、"地图"、"个人"等关键词
3. 下载 PNG 格式的图标（建议尺寸：81x81px，@2x）
4. 将图标重命名并放入此目录：
   - `home.png` / `home-active.png`
   - `ranking.png` / `ranking-active.png`
   - `map.png` / `map-active.png`
   - `profile.png` / `profile-active.png`

### 方法二：使用纯色占位图

如果你暂时没有图标，可以创建简单的纯色占位图：

1. 使用任何图片编辑工具（如 Preview、Photoshop）
2. 创建 81x81px 的纯色图片
3. 保存为 PNG 格式
4. 普通状态用灰色，选中状态用红色（#d32f2f）

### 方法三：暂时不添加图标

**完全可以！** 小程序可以正常运行，只是底部导航栏没有图标，只有文字。等你有时间再添加图标也不迟。

## 其他需要的图片

- `default-avatar.png` - 默认头像（120x120px）
- `longmarch-logo.png` - Logo（200x200px，登录页用）
- `medal-gold.png` / `medal-silver.png` / `medal-bronze.png` - 排行榜奖牌（60x60px）

这些图片暂时缺失也不会影响基本功能，可以后续添加。

## 恢复图标配置

当你准备好图标后，在 `app.json` 中恢复图标配置：

```json
{
  "pagePath": "pages/index/index",
  "iconPath": "images/home.png",
  "selectedIconPath": "images/home-active.png",
  "text": "首页"
}
```
