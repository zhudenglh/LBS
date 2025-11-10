# 项目编译依赖配置文档

> 记录时间: 2025-11-10
> React Native Version: 0.74.5
> NativeWind Version: 4.1.23

## 目录

- [核心依赖版本](#核心依赖版本)
- [关键配置文件](#关键配置文件)
- [Android 编译环境](#android-编译环境)
- [已知版本兼容性问题](#已知版本兼容性问题)
- [编译步骤](#编译步骤)

---

## 核心依赖版本

### 生产依赖 (dependencies)

```json
{
  "@react-native-async-storage/async-storage": "^1.23.1",
  "@react-navigation/bottom-tabs": "^6.5.20",
  "@react-navigation/native": "^6.1.17",
  "@react-navigation/stack": "^6.3.29",
  "axios": "^1.6.8",
  "i18next": "^23.11.2",
  "nativewind": "^4.1.23",
  "react": "18.2.0",
  "react-i18next": "^14.1.0",
  "react-native": "0.74.5",
  "react-native-fast-image": "^8.6.3",
  "react-native-gesture-handler": "~2.16.1",
  "react-native-image-picker": "^7.1.2",
  "react-native-linear-gradient": "^2.8.3",
  "react-native-reanimated": "~3.15.0",
  "react-native-safe-area-context": "5.4.0",
  "react-native-screens": "^3.31.1",
  "react-native-svg": "15.2.0",
  "tailwindcss": "3.4.17"
}
```

### 开发依赖 (devDependencies)

```json
{
  "@babel/core": "^7.24.4",
  "@babel/preset-env": "^7.24.4",
  "@babel/runtime": "^7.24.4",
  "@react-native-community/cli": "^13.6.6",
  "@react-native-community/cli-platform-android": "^13.6.6",
  "@react-native-community/cli-platform-ios": "^13.6.6",
  "@react-native/babel-preset": "0.74.87",
  "@react-native/eslint-config": "0.74.87",
  "@react-native/metro-config": "0.74.87",
  "@react-native/typescript-config": "0.74.87",
  "@testing-library/react-native": "^12.5.0",
  "@types/jest": "^30.0.0",
  "@types/react": "^18.2.79",
  "@types/react-test-renderer": "^18.3.0",
  "babel-plugin-module-resolver": "^5.0.2",
  "eslint": "^8.57.0",
  "jest": "^29.7.0",
  "prettier": "^3.2.5",
  "prettier-plugin-tailwindcss": "^0.5.11",
  "react-native-svg-transformer": "^1.5.2",
  "react-test-renderer": "18.2.0",
  "typescript": "^5.4.5"
}
```

---

## 关键配置文件

### 1. babel.config.js

```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      '@babel/plugin-transform-react-jsx',
      {
        runtime: 'automatic',
        importSource: 'nativewind',
      },
    ],
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
    'react-native-reanimated/plugin', // Must be last
  ],
};
```

**关键点**:
- `@babel/plugin-transform-react-jsx` 是 NativeWind 4 必需的
- `runtime: 'automatic'` 和 `importSource: 'nativewind'` 配置不可缺少
- `react-native-reanimated/plugin` 必须放在最后

### 2. metro.config.js

```javascript
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {withNativeWind} = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: defaultConfig.resolver.assetExts.filter(
      ext => ext !== 'svg',
    ),
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
  },
};

module.exports = withNativeWind(mergeConfig(defaultConfig, config), {input: './global.css'});
```

**关键点**:
- 使用 `withNativeWind` 包装配置
- 必须指定 `input: './global.css'`
- 支持 SVG 文件作为组件导入

### 3. tailwind.config.js

```javascript
module.exports = {
  content: [
    './index.js',
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require("nativewind/preset")],  // NativeWind 4 必需
  theme: {
    extend: {
      colors: {
        // 自定义颜色配置
      },
    },
  },
};
```

**关键点**:
- 必须添加 `presets: [require("nativewind/preset")]`
- content 配置要包含所有使用 NativeWind 的文件路径

### 4. tsconfig.json (关键部分)

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "jsx": "react-native",  // 保持为 react-native，不要改为 react-jsx
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@screens/*": ["src/screens/*"],
      "@api/*": ["src/api/*"],
      "@types/*": ["src/types/*"],
      "@utils/*": ["src/utils/*"],
      "@constants/*": ["src/constants/*"],
      "@contexts/*": ["src/contexts/*"],
      "@hooks/*": ["src/hooks/*"],
      "@i18n/*": ["src/i18n/*"]
    }
  },
  "include": [
    "src/**/*",
    "__tests__/**/*",
    "nativewind-env.d.ts"
  ]
}
```

### 5. global.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 6. nativewind-env.d.ts

```typescript
/// <reference types="nativewind/types" />
```

### 7. src/App.tsx (顶部必需)

```typescript
/** @jsxImportSource nativewind */

import './i18n';
import '../global.css';
```

---

## Android 编译环境

### android/build.gradle

```gradle
buildscript {
    ext {
        buildToolsVersion = "34.0.0"
        minSdkVersion = 23
        compileSdkVersion = 35
        targetSdkVersion = 35
        ndkVersion = "26.1.10909125"
        kotlinVersion = "1.9.24"
    }
    dependencies {
        classpath("com.android.tools.build:gradle:8.3.0")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:1.9.24")
    }
}
```

### android/gradle/wrapper/gradle-wrapper.properties

```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.7-all.zip
```

### 系统环境要求

- **Node.js**: >= 18
- **JDK**: 17 或 11
- **Android SDK**: API 35
- **NDK**: 26.1.10909125
- **Gradle**: 8.7
- **Kotlin**: 1.9.24

---

## 已知版本兼容性问题

### 1. react-native-reanimated

| 版本 | React Native 兼容性 | 状态 |
|------|---------------------|------|
| ~3.17.4 | RN 0.75+ | ❌ 不兼容 RN 0.74 |
| ~3.15.0 | RN 0.72-0.75 | ✅ 推荐使用 |

**问题**: 使用 `~3.17.4` 会导致编译错误:
```
Execution failed for task ':react-native-reanimated:assertMinimalReactNativeVersionTask'
[Reanimated] Unsupported React Native version. Please use 75. or newer.
```

**解决方案**: 降级到 `~3.15.0`

### 2. react-native-svg

| 版本 | React Native 兼容性 | 状态 |
|------|---------------------|------|
| ^15.3.0 | - | ❌ 编译错误 |
| 15.2.0 | RN 0.74 | ✅ 推荐使用 |

**问题**: 使用 `^15.3.0` 会导致 Java 编译错误:
```
error: no suitable method found for processTransform(...)
error: translation is not public in MatrixDecompositionContext
```

**解决方案**: 使用固定版本 `15.2.0`

### 3. NativeWind 4

**必需配置**:

1. **babel.config.js** 中必须添加:
```javascript
[
  '@babel/plugin-transform-react-jsx',
  {
    runtime: 'automatic',
    importSource: 'nativewind',
  },
]
```

2. **metro.config.js** 必须使用 `withNativeWind` 包装

3. **App.tsx** 顶部必须添加:
```typescript
/** @jsxImportSource nativewind */
import '../global.css';
```

**常见问题**: 如果 NativeWind 样式不生效，检查:
- [ ] babel 配置是否正确
- [ ] metro 配置是否使用 withNativeWind
- [ ] global.css 是否正确导入
- [ ] nativewind-env.d.ts 是否存在
- [ ] tailwind.config.js 是否添加 preset

### 4. gap 属性兼容性

NativeWind 4 中，`gap` 工具类可能不生效，需要使用内联样式:

```tsx
// ❌ 可能不工作
<View className="gap-3">

// ✅ 推荐
<View style={{ gap: 12 }}>
```

---

## 编译步骤

### 完整清理和重建

```bash
# 1. 清理所有缓存
rm -rf node_modules package-lock.json
npm install

# 2. 清理 watchman
watchman watch-del-all

# 3. 清理 Metro 缓存
rm -rf $TMPDIR/react-* $TMPDIR/metro-*

# 4. 清理 Android 构建
cd android
./gradlew clean
cd ..

# 5. 启动 Metro (新终端)
npx react-native start --reset-cache

# 6. 构建并运行 Android (新终端)
npm run android
```

### 快速重建

```bash
# 仅当代码更改时
cd android
./gradlew clean
cd ..
npm run android
```

### 检查编译环境

```bash
# 检查 Node 版本
node --version  # 应该 >= 18

# 检查 Java 版本
java -version  # 应该是 JDK 11 或 17

# 检查 Android SDK
echo $ANDROID_HOME

# 检查已安装的包版本
npm list react-native
npm list react-native-reanimated
npm list react-native-svg
npm list nativewind
```

---

## 故障排查

### 问题 1: Metro bundler 找不到 tailwind.config

**错误信息**:
```
Cannot find module '/path/to/android/tailwind.config'
```

**原因**: 在 android 子目录运行了 Metro

**解决方案**: 确保在项目根目录运行 `npx react-native start`

### 问题 2: NativeWind 样式不生效

**检查清单**:
1. ✅ babel.config.js 中有 JSX 自动转换配置
2. ✅ metro.config.js 使用 withNativeWind
3. ✅ App.tsx 有 `/** @jsxImportSource nativewind */`
4. ✅ App.tsx 导入了 global.css
5. ✅ tailwind.config.js 有 NativeWind preset
6. ✅ 清理了所有缓存后重启

### 问题 3: Android 编译失败

**常见原因**:
1. 依赖版本不兼容 (检查 react-native-reanimated 和 react-native-svg)
2. NDK 版本不匹配
3. Gradle 缓存问题

**解决方案**:
```bash
cd android
./gradlew clean
./gradlew --stop
cd ..
rm -rf node_modules
npm install
```

---

## Git 提交清单

提交前确认:

- [ ] `package.json` 中的版本号已固定
- [ ] `package-lock.json` 已生成并提交
- [ ] 所有配置文件已更新
- [ ] Android 编译成功
- [ ] iOS 编译成功 (如适用)
- [ ] Metro bundler 无警告
- [ ] 应用可以正常启动

---

## 版本历史

### 2025-11-10 - 初始配置

- ✅ React Native 升级到 0.74.5
- ✅ 安装 NativeWind 4.1.23
- ✅ 修复 react-native-reanimated 兼容性 (3.17.4 → 3.15.0)
- ✅ 修复 react-native-svg 兼容性 (^15.3.0 → 15.2.0)
- ✅ 配置 babel JSX 自动转换
- ✅ Android 编译成功

---

## 参考链接

- [React Native 0.74 Release Notes](https://reactnative.dev/blog/2024/04/22/release-0.74)
- [NativeWind v4 Documentation](https://www.nativewind.dev/v4/overview)
- [react-native-reanimated Compatibility](https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/)
- [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/)
