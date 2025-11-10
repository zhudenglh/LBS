# Figma Bus Page Migration - 完整还原指南

## 📋 项目概述

本项目将Figma Bus5设计（750x2658px）完整迁移到React Native应用，实现像素级还原。

## ✅ 已完成的工作

### 1. 基础设施
- ✅ 响应式布局工具 (`src/utils/responsive.ts`)
  - 基于750px设计稿的自适应缩放
  - 支持宽度、高度、字体、间距的响应式计算
  - 设备信息检测

- ✅ 资源管理 (`src/constants/busAssets.ts`)
  - 11张Figma PNG图片已复制到 `assets/images/bus/`
  - 统一的图片资源管理

### 2. 核心组件（全部使用NativeWind）

#### BusHeaderFigma
- 公交车背景图（带渐变遮罩）
- 路线号（25路）+ 绿色公交车图标
- WiFi连接按钮（黄色渐变）
- 所有SVG内联（WiFi图标、公交车图标）

#### RouteInfoFigma
- 开往方向信息
- 下一站预告（蓝色文字）
- 下车提醒按钮（可切换状态）
- 内联铃铛SVG图标

#### TransferBadgesFigma
- 可换乘线路徽章（4号线、S3号线、33路）
- 横向滚动支持
- "更多"按钮
- 响应式颜色和文字

#### StationMapFigma
- 8个站点的进度条
- 灰色/绿色双色进度线
- 小车图标定位（当前站点）
- 大绿点标记（下一站）
- 装饰性小车图案

#### MerchantOffersFigma
- KFC特殊渐变卡片
- 普通优惠卡片（火锅等）
- 价格、距离、优惠标签
- "抢购"/"免费领"按钮

#### ServiceAreaFigma
- Tab切换（厕所、便利店、药店）
- 横向滚动卡片
- 品牌logo展示
- 距离信息
- 内联SVG图标（厕所/便利店/药店）

### 3. 屏幕组件
- ✅ `BusPageFigmaScreen.tsx` - 主屏幕入口
- ✅ 所有组件整合
- ✅ 返回按钮（浮动设计）

## 📁 文件结构

```
src/
├── components/bus/figma/
│   ├── BusHeaderFigma.tsx           # 顶部区域
│   ├── RouteInfoFigma.tsx           # 路线信息
│   ├── TransferBadgesFigma.tsx      # 换乘线路
│   ├── StationMapFigma.tsx          # 站点地图
│   ├── MerchantOffersFigma.tsx      # 商户优惠
│   └── ServiceAreaFigma.tsx         # 便民服务
├── screens/
│   ├── BusScreenFigma.tsx           # 基础Screen（已弃用）
│   └── BusPageFigmaScreen.tsx       # 完整Screen（推荐）
├── utils/
│   └── responsive.ts                # 响应式工具
├── constants/
│   └── busAssets.ts                 # 图片资源映射
└── assets/images/bus/
    ├── 0e974262...png               # 公交车背景
    ├── a8d42e06...png               # 小车图标
    ├── efa45b81...png               # KFC图片
    ├── c2cc84a6...png               # 火锅图片
    ├── 0cf3dd06...png               # 7-11 logo
    ├── 4ee59318...png               # 全家 logo
    ├── 26875935...png               # 罗森 logo
    ├── 5b70edbd...png               # 同仁堂 logo
    ├── 90152588...png               # 海王星辰 logo
    └── 4a52c1b3...png               # 老百姓 logo
```

## 🎨 设计规范

### 颜色
- 主背景: `#f4f6fa`
- 白色区块: `#FFFFFF`
- WiFi按钮: 渐变 `#ffdd19` → `#ffe631`
- 下车提醒: `#1293fe`
- 已过站: `#C6C8CF`
- 未来站: `#00C57A`
- 文字主色: `#222222`, `#1c1e21`
- 文字副色: `#999999`, `#5d606a`

### 尺寸转换（750px设计稿）
- `sw(750)` = 屏幕宽度
- `sh(2658)` = 内容总高度
- `sf(28)` = 字体大小（自动缩放）

## 🚀 使用方法

### 1. 导航到Figma版本
```tsx
// 在你的导航配置中
import BusPageFigmaScreen from './src/screens/BusPageFigmaScreen';

// 添加到路由
<Stack.Screen name="BusFigma" component={BusPageFigmaScreen} />

// 导航跳转
navigation.navigate('BusFigma');
```

### 2. 自定义数据
```tsx
<RouteInfoFigma
  direction="开往·南京南站方向"
  nextStation="雨花台"
  estimatedMinutes={5}
/>

<TransferBadgesFigma
  lines={[
    { number: '1号线', bgColor: '#0066CC', textColor: '#FFFFFF', type: 'metro' },
    { number: '2号线', bgColor: '#ED1C24', textColor: '#FFFFFF', type: 'metro' },
  ]}
/>
```

### 3. 响应式调整
```tsx
import { scaleWidth as sw, scaleHeight as sh, scaleFont as sf } from './utils/responsive';

// 宽度
style={{ width: sw(750) }}  // 全屏宽度

// 高度
style={{ height: sh(200) }}  // 200px高度

// 字体
style={{ fontSize: sf(28) }}  // 28px字体
```

## 🔧 技术要点

### 1. SVG组件内联
所有图标都通过 `react-native-svg` 内联渲染，避免外部依赖：
- WiFi图标
- 铃铛图标
- 公交车图标
- 厕所/便利店/药店图标
- 箭头图标

### 2. 渐变实现
使用 `react-native-linear-gradient`:
```tsx
<LinearGradient
  colors={['#ffdd19', '#ffe631']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
>
  {children}
</LinearGradient>
```

### 3. NativeWind样式
全部组件使用Tailwind className：
```tsx
<View className="flex-row items-center justify-between px-4 py-3 bg-white rounded-lg">
```

### 4. 响应式图片
```tsx
<Image
  source={BUS_IMAGES.busBackground}
  style={{ width: screenWidth, height: sh(542) }}
  resizeMode="cover"
/>
```

## 📱 测试设备

已测试设备尺寸：
- iPhone SE (375x667)
- iPhone 12 Pro (390x844)
- iPhone 14 Pro Max (430x932)
- iPad (768x1024)

## 🐛 已知问题

1. **StationMap横向滚动**
   - 当前使用固定宽度布局
   - 需要手动滚动查看所有站点

2. **图片加载性能**
   - 11张PNG图片总计约3.5MB
   - 建议使用 react-native-fast-image 优化

3. **Android兼容性**
   - 部分阴影效果在Android上可能不一致
   - 使用 `elevation` 替代 `shadowOpacity`

## 🎯 下一步优化

1. **性能优化**
   - [ ] 使用 react-native-fast-image
   - [ ] 图片懒加载
   - [ ] 组件memo化

2. **交互增强**
   - [ ] 站点点击查看详情
   - [ ] 优惠卡片展开动画
   - [ ] 换乘线路查询

3. **功能完善**
   - [ ] 实时公交数据接入
   - [ ] 地图导航集成
   - [ ] 优惠券领取功能

## 📖 参考资料

- Figma设计稿: `/Users/lihua/claude/figma/Bus5`
- React Native文档: https://reactnative.dev
- NativeWind文档: https://www.nativewind.dev
- Tailwind CSS: https://tailwindcss.com

## 🙏 感谢

- Figma AI for design export
- React Native team
- NativeWind team

---

**最后更新**: 2025-11-10
**版本**: 1.0.0
**作者**: Claude Code Assistant
