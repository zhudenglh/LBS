# 在Android Studio中打包APK

## 方法一：使用菜单构建（推荐）

1. 在Android Studio中打开项目
2. 点击菜单：**Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. 等待构建完成（右下角会显示进度）
4. 构建成功后会弹出提示，点击 **locate** 可以找到APK文件
5. APK位置：`HelloWorldApp/app/build/outputs/apk/debug/app-debug.apk`

## 方法二：使用Gradle面板

1. 在Android Studio右侧点击 **Gradle** 标签
2. 展开：**HelloWorldApp → app → Tasks → build**
3. 双击 **assembleDebug**
4. 等待构建完成
5. APK位置同上

## 安装APK到手机

### 选项A：通过USB连接（推荐）

1. **启用开发者选项**：
   - 打开手机「设置」→「关于手机」
   - 连续点击「版本号」7次，启用开发者模式
   
2. **启用USB调试**：
   - 返回设置，找到「开发者选项」
   - 开启「USB调试」

3. **连接并安装**：
   - 用USB线连接手机和电脑
   - 手机上允许USB调试授权
   - 在终端运行：
     ```bash
     adb install /Users/bytedance/Documents/claude/HelloWorldApp/app/build/outputs/apk/debug/app-debug.apk
     ```

### 选项B：通过文件传输

1. 将 `app-debug.apk` 文件传到手机（通过微信、QQ、AirDrop等）
2. 在手机上点击APK文件
3. 允许「安装未知应用」权限
4. 点击安装

## 注意事项

- Debug版APK仅用于测试，不能发布到应用商店
- 如需发布，需要构建Release版并签名
- 安装时可能提示「未知来源」，需要在设置中允许

