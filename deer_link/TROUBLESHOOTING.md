# Troubleshooting Guide

## NativeWind v4 配置问题（已解决）

### 问题描述
- **时间**: 2025-11-09
- **症状**: Profile 页面布局完全错乱，所有元素堆叠在左上角
- **错误信息**: `[BABEL] .plugins is not a valid Plugin property`

### 根本原因
在 2025-11-06 的提交中，错误地在 `babel.config.js` 中添加了 `'nativewind/babel'` 插件。

这是 **NativeWind v3** 的配置方式，但项目使用的是 **NativeWind v4**，导致 Babel 配置错误。

### NativeWind 版本对比

| 配置项 | NativeWind v3 | NativeWind v4 (项目使用) |
|--------|---------------|-------------------------|
| `babel.config.js` | ✅ 需要 `'nativewind/babel'` | ❌ **不需要** |
| `metro.config.js` | ❌ 不需要 | ✅ 需要 `withNativeWind()` |

### 正确配置

**babel.config.js** ✅
```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // ⚠️ NativeWind v4 不需要 'nativewind/babel'
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@api': './src/api',
          '@types': './src/types',
          '@utils': './src/utils',
          '@constants': './src/constants',
          '@contexts': './src/contexts',
          '@hooks': './src/hooks',
          '@i18n': './src/i18n',
        },
      },
    ],
  ],
};
```

**metro.config.js** ✅
```javascript
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {withNativeWind} = require('nativewind/metro');

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: getDefaultConfig(__dirname).resolver.assetExts.filter(
      ext => ext !== 'svg',
    ),
    sourceExts: [...getDefaultConfig(__dirname).resolver.sourceExts, 'svg'],
  },
};

module.exports = withNativeWind(
  mergeConfig(getDefaultConfig(__dirname), config),
  { input: './global.css' }
);
```

### 解决步骤

1. **移除错误的 Babel 配置**
   - 从 `babel.config.js` 中删除 `'nativewind/babel'`

2. **Profile 组件改为 StyleSheet**
   - `ProfileScreen.tsx`
   - `ProfileHeader.tsx`
   - `StatsCard.tsx`
   - `SettingItem.tsx`
   - `LanguageSelector.tsx`

3. **清除所有缓存**
   ```bash
   pkill -9 -f metro
   rm -rf node_modules/.cache
   rm -rf node_modules/react-native-css-interop/.cache
   rm -rf .metro
   cd android && ./gradlew clean && cd ..
   npm start -- --reset-cache
   ```

4. **重新构建应用**
   ```bash
   npm run android
   ```

### 结果
- ✅ Profile 页面布局正常（使用 StyleSheet）
- ✅ 其他页面正常（使用 NativeWind className）
- ✅ 不再有 Babel 错误
- ✅ SVG 本地资源正常加载

### 关键经验

1. **NativeWind v4 只需要在 metro.config.js 中配置**
   - 使用 `withNativeWind()` 包装配置
   - 不需要 Babel 插件

2. **缓存会掩盖配置错误**
   - 配置更改后务必清除所有缓存
   - 使用 `--reset-cache` 重启 Metro

3. **StyleSheet vs className 可以共存**
   - Profile 模块使用 StyleSheet（不依赖 NativeWind）
   - 其他模块使用 className（NativeWind）
   - 两种方式可以在同一项目中并存

### 参考资料
- NativeWind v4 文档: https://www.nativewind.dev/v4/getting-started/react-native
- React Native SVG Transformer: https://github.com/kristerkari/react-native-svg-transformer

---

## SVG 本地化迁移（已完成）

### 问题
Figma Desktop MCP 服务器的 SVG 资源包含 CSS 变量，React Native 不支持。

### 解决方案
1. 下载所有 SVG 到 `assets/svgs/`
2. 创建清理脚本 `scripts/clean-svgs.js` 移除不支持的特性
3. 配置 `react-native-svg-transformer`
4. 将所有 `RemoteSvg` 替换为本地 SVG 导入

详见: `assets/svgs/README.md`

---

## 常见问题

### Q: Metro bundler 报 Babel 错误
**A**: 清除缓存并重启
```bash
pkill -9 -f metro
rm -rf node_modules/.cache node_modules/react-native-css-interop/.cache .metro
npm start -- --reset-cache
```

### Q: Android 构建失败
**A**: 清理 Gradle 缓存
```bash
cd android
./gradlew clean
rm -rf .gradle app/build
cd ..
```

### Q: 样式不生效
**A**: 检查是否使用了正确的样式方案
- NativeWind: `<View className="flex-1" />`
- StyleSheet: `<View style={styles.container} />`
- 确保 metro.config.js 正确配置了 NativeWind
