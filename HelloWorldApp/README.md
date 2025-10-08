# Hello World Android App

这是一个简单的Android应用，打开后会在屏幕中央显示"Hello, World"文字。

## 项目结构
```
HelloWorldApp/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/example/helloworldapp/
│   │       │   └── MainActivity.java
│   │       ├── res/
│   │       │   ├── layout/
│   │       │   │   └── activity_main.xml
│   │       │   └── values/
│   │       │       └── strings.xml
│   │       └── AndroidManifest.xml
│   └── build.gradle
├── build.gradle
├── settings.gradle
└── gradle.properties
```

## 如何运行

### 方法一：使用Android Studio（推荐）
1. 下载并安装 [Android Studio](https://developer.android.com/studio)
2. 打开Android Studio，选择 "Open an Existing Project"
3. 选择 `HelloWorldApp` 文件夹
4. 等待Gradle同步完成
5. 连接Android设备或启动模拟器
6. 点击运行按钮（绿色三角形）

### 方法二：使用命令行
1. 确保已安装Android SDK和配置好环境变量
2. 在项目根目录运行：
   ```bash
   ./gradlew assembleDebug
   ```
3. 安装生成的APK到设备：
   ```bash
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

## 系统要求
- **最低Android版本**：Android 5.0 (API 21)
- **目标Android版本**：Android 14 (API 34)
- **编译工具**：Android Studio 或 Gradle

## 功能说明
应用启动后会显示一个简单的界面，屏幕中央显示"Hello, World"文字。

## 技术栈
- **开发语言**：Java
- **最低SDK**：21 (Android 5.0)
- **目标SDK**：34 (Android 14)
- **构建工具**：Gradle 8.2.0
