# Babel Runtime 错误修复说明

## 问题原因

错误信息：`Error: module '@babel/runtime/helpers/defineProperty.js' is not defined`

这个错误是因为代码中使用了 **ES6+ 的对象展开运算符** (`...`)，但小程序环境没有正确配置 Babel 转译，导致运行时找不到相应的辅助函数。

## 已修复的问题

### 1. ✅ login.js 中的对象展开运算符

**原代码**（第 102 行）：
```javascript
app.globalData.userInfo = {
  ...this.data.userInfo,
  department: this.data.selectedDepartment
}
```

**修复后**：
```javascript
app.globalData.userInfo = Object.assign({}, this.data.userInfo, {
  department: this.data.selectedDepartment
})
```

### 2. ✅ ranking.js 中的对象展开运算符

**原代码**：
```javascript
const rankingWithDistance = ranking.map(item => ({
  ...item,
  distance: parseFloat(util.stepsToDistance(item.totalSteps)),
  progress: util.distanceToPercent(parseFloat(util.stepsToDistance(item.totalSteps)))
}))
```

**修复后**：
```javascript
const rankingWithDistance = ranking.map(item => {
  return Object.assign({}, item, {
    distance: parseFloat(util.stepsToDistance(item.totalSteps)),
    progress: util.distanceToPercent(parseFloat(util.stepsToDistance(item.totalSteps)))
  })
})
```

### 3. ✅ 修复了 picker 组件的数据绑定

**问题**：`login.wxml` 中的 picker 使用了 `value="{{selectedDepartmentIndex}}"`，但 `onDepartmentChange` 方法没有正确处理索引。

**修复**：
- 添加了 `selectedDepartmentIndex` 到 data
- 修复了 `onDepartmentChange` 方法，正确获取选中的处室名称

## 修改的文件

1. `miniprogram/pages/login/login.js`
   - 将对象展开运算符改为 `Object.assign`
   - 修复 picker 选择逻辑

2. `miniprogram/pages/ranking/ranking.js`
   - 将对象展开运算符改为 `Object.assign`

## 为什么使用 Object.assign？

`Object.assign` 是 ES5 标准的方法，小程序环境原生支持，不需要 Babel 转译：

```javascript
// ES6+ 语法（需要 Babel）
const newObj = { ...oldObj, newProp: 'value' }

// ES5 语法（原生支持）
const newObj = Object.assign({}, oldObj, { newProp: 'value' })
```

## 测试步骤

1. **重新编译小程序**
   - 在微信开发者工具中点击"编译"
   - 应该不再有 Babel 错误

2. **测试登录页面**
   - 打开登录页
   - 选择处室（应该能正常选择）
   - 点击"开始记录"（应该能正常跳转）

3. **测试排行榜**
   - 打开排行榜页面
   - 应该能正常显示数据

## 如果还有问题

### 问题1：还有其他 Babel 错误

**解决**：检查代码中是否还有其他 ES6+ 语法：
- 对象展开运算符 `...`
- 可选链操作符 `?.`
- 空值合并操作符 `??`
- 箭头函数中的复杂语法

### 问题2：picker 选择不正常

**检查**：
- `departments` 数组是否正确初始化
- `onDepartmentChange` 方法是否正确处理索引

### 问题3：页面仍然无法显示

**排查步骤**：
1. 查看 Console 是否还有其他错误
2. 检查 Network 面板，看 API 请求是否正常
3. 检查后端服务是否运行

## 小程序兼容性建议

为了避免类似问题，建议：

1. **避免使用需要转译的 ES6+ 语法**：
   - 对象展开运算符 `...`
   - 可选链 `?.`
   - 空值合并 `??`

2. **使用 ES5 兼容语法**：
   - `Object.assign()` 代替对象展开
   - `obj && obj.prop` 代替可选链
   - `value || defaultValue` 代替空值合并

3. **如果必须使用 ES6+ 语法**：
   - 配置 Babel 转译
   - 或者使用构建工具（如 webpack）

## 当前状态

✅ Babel runtime 错误已修复
✅ 对象展开运算符已替换为 Object.assign
✅ picker 选择逻辑已修复

现在请重新编译小程序，应该可以正常运行了！
