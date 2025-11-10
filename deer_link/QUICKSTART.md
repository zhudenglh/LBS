# 🚀 Figma公交页面 - 快速启动指南

## ✅ PNG文件已修复

所有11张图片已从Base64解码为真实PNG文件：
```bash
assets/images/bus/
├── 0cf3dd0663cc...png  (145KB) - 7-11 logo
├── 0e974262834...png  (128KB) - 公交车背景
├── 26875935242...png  (181KB) - 罗森 logo
├── 280f52b8a3f...png  (238KB) - 优惠图1
├── 4a52c1b3e44...png  (288KB) - 老百姓 logo
├── 4ee59318958...png  (57KB)  - 全家 logo
├── 5b70edbd8de...png  (320KB) - 同仁堂 logo
├── 90152588631...png  (544KB) - 海王星辰 logo
├── a8d42e06c91...png  (9KB)   - 小车图标
├── c2cc84a614c...png  (407KB) - 优惠图2
└── efa45b81254...png  (225KB) - KFC图片
```

## 🎯 现在可以运行了！

### 第一步：清除缓存并启动Metro
```bash
# 清除所有缓存
npm start -- --reset-cache
```

### 第二步：在新终端运行应用
```bash
# Android
npm run android

# 或 iOS
npm run ios
```

### 第三步：测试Figma页面

在应用中导航到新的公交页面：

**选项A：作为独立页面测试**
```tsx
// 在你的导航中添加
import BusPageFigmaScreen from './src/screens/BusPageFigmaScreen';

<Stack.Screen
  name="BusFigma"
  component={BusPageFigmaScreen}
  options={{ headerShown: false }}
/>

// 跳转测试
navigation.navigate('BusFigma');
```

**选项B：替换现有Bus Tab**
```tsx
// src/navigation/MainNavigator.tsx
import BusPageFigmaScreen from '../screens/BusPageFigmaScreen';

// 替换
<Tab.Screen
  name="Bus"
  component={BusPageFigmaScreen}  // 原来是 BusPageScreenNew
  options={{
    tabBarLabel: '公交',
    tabBarIcon: ({ color }) => <BusIcon color={color} />,
  }}
/>
```

## 📱 预期效果

你将看到：
1. ✅ 公交车背景图（顶部大图）
2. ✅ "25路" + WiFi按钮（黄色渐变）
3. ✅ 路线信息："开往·张江高科方向"
4. ✅ 下车提醒按钮（蓝色，可点击切换黄色）
5. ✅ 换乘线路徽章（4号线、S3号线、33路）
6. ✅ 8个站点的进度条 + 小车图标
7. ✅ 3张商户优惠卡片（KFC免费、火锅抢购）
8. ✅ 便民服务Tab切换（厕所、便利店、药店）

## 🐛 如果遇到问题

### 问题1：图片不显示
```bash
# 重新清除缓存
rm -rf node_modules/.cache
watchman watch-del-all
npm start -- --reset-cache
```

### 问题2：还是报"unsupported file type"
```bash
# 验证PNG文件
file assets/images/bus/0cf3dd0663cc153b47c6e9fac777380a50aa7b52.png
# 应该显示: PNG image data

# 如果显示ASCII text，重新解码：
cd /Users/lihua/claude/figma/Bus5/src/assets
for f in *.png; do
  base64 -D -i "$f" -o "/Users/lihua/claude/LBS/deer_link/assets/images/bus/$f"
done
```

### 问题3：Metro端口被占用
```bash
# 杀掉进程
pkill -f "react-native"
lsof -ti:8081 | xargs kill -9

# 重启
npm start
```

## 🎨 自定义数据

### 修改路线信息
```tsx
// src/screens/BusPageFigmaScreen.tsx
<RouteInfoFigma
  direction="开往·南京南站方向"  // 改成你的路线
  nextStation="雨花台"            // 改成你的站点
  estimatedMinutes={5}           // 改成预计时间
/>
```

### 修改换乘线路
```tsx
<TransferBadgesFigma
  lines={[
    { number: '1号线', bgColor: '#0066CC', textColor: '#FFF', type: 'metro' },
    { number: '2号线', bgColor: '#ED1C24', textColor: '#FFF', type: 'metro' },
  ]}
/>
```

### 修改站点
```tsx
<StationMapFigma
  stations={[
    { name: '新街口', passed: true },
    { name: '珠江路', passed: true },
    { name: '鼓楼', passed: false },
    // ... 更多站点
  ]}
  currentIndex={2}      // 当前在第3站
  nextStationIndex={3}  // 下一站是第4站
/>
```

## 📖 完整文档

- 详细技术文档: `FIGMA_MIGRATION_README.md`
- 组件API文档: `src/components/bus/figma/`
- 响应式工具: `src/utils/responsive.ts`

## 🎉 完成！

现在你有一个完全还原Figma设计的公交页面！

遇到问题？查看 `FIGMA_MIGRATION_README.md` 获取更多帮助。
