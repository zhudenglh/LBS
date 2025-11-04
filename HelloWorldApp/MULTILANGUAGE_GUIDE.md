# 多语言功能使用指南 / Multilanguage Feature Guide

## 概述 / Overview

HelloWorldApp 现在支持三种语言：
- 中文（默认）/ Chinese (Default)
- English / 英文
- Bahasa Indonesia / 印尼语

## 已完成的功能 / Completed Features

### 1. 字符串资源文件 / String Resource Files

已创建三个语言版本的字符串资源：

- `app/src/main/res/values/strings.xml` - 中文（默认）
- `app/src/main/res/values-en/strings.xml` - 英文
- `app/src/main/res/values-in/strings.xml` - 印尼语

### 2. LanguageHelper 工具类 / LanguageHelper Utility Class

位置：`app/src/main/java/com/example/helloworldapp/LanguageHelper.java`

功能：
- 保存和获取用户选择的语言
- 应用语言设置到应用上下文
- 切换语言并重启 Activity
- 获取语言显示名称

### 3. MainActivity 集成 / MainActivity Integration

已在 MainActivity 中添加：
- `attachBaseContext()` 方法：在 Activity 创建时应用保存的语言设置
- `showLanguageSelectionDialog()` 方法：显示语言选择对话框

## 如何使用 / How to Use

### 方式 1：通过"我的收藏"按钮测试（临时方案）

在 MainActivity.java 的第 414 行，取消注释以下代码：

```java
// 临时方案：可以将我的收藏按钮用作语言设置（仅用于测试）
// 取消下面这行的注释来将"我的收藏"按钮临时改为语言设置
btnMyCollects.setOnClickListener(v -> showLanguageSelectionDialog());
```

这样点击"我的收藏"按钮时会打开语言选择对话框。

### 方式 2：在布局中添加语言设置按钮（推荐）

1. 打开您的"我的"页面布局文件（通常是 `activity_main.xml` 或类似文件）

2. 在"我的"页面中添加一个新的按钮：

```xml
<LinearLayout
    android:id="@+id/btnLanguageSettings"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="horizontal"
    android:padding="16dp"
    android:background="?android:attr/selectableItemBackground"
    android:gravity="center_vertical">

    <TextView
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_weight="1"
        android:text="@string/language_settings"
        android:textSize="16sp"
        android:textColor="#333333" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text=">"
        android:textSize="18sp"
        android:textColor="#999999" />
</LinearLayout>
```

3. 重新运行应用，MainActivity 会自动检测并绑定点击事件

## 如何在代码中使用字符串资源 / How to Use String Resources in Code

### 在 Java 代码中：

```java
// 方式 1：直接使用资源 ID
String appName = getString(R.string.app_name);

// 方式 2：使用格式化字符串
String greeting = getString(R.string.welcome_hello, username);

// 方式 3：在 Toast 中使用
Toast.makeText(this, R.string.wifi_connect_success, Toast.LENGTH_SHORT).show();

// 方式 4：在 TextView 中使用
textView.setText(R.string.language_settings);
```

### 在 XML 布局中：

```xml
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/app_name" />

<Button
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/btn_confirm" />
```

## 示例：更新现有代码使用字符串资源 / Example: Update Existing Code

### 原代码 / Before:
```java
wifiButton.setText("已连接");
Toast.makeText(this, "WiFi连接成功", Toast.LENGTH_SHORT).show();
```

### 更新后 / After:
```java
wifiButton.setText(R.string.wifi_connected);
Toast.makeText(this, R.string.wifi_connect_success, Toast.LENGTH_SHORT).show();
```

## 添加新的字符串资源 / Adding New String Resources

当您需要添加新的文本时：

1. 在三个 `strings.xml` 文件中添加相同的键，但使用不同语言的值：

**values/strings.xml (中文):**
```xml
<string name="my_new_text">我的新文本</string>
```

**values-en/strings.xml (English):**
```xml
<string name="my_new_text">My New Text</string>
```

**values-in/strings.xml (Bahasa Indonesia):**
```xml
<string name="my_new_text">Teks Baru Saya</string>
```

2. 在代码中使用：
```java
textView.setText(R.string.my_new_text);
```

## 语言切换流程 / Language Switching Flow

1. 用户点击语言设置按钮
2. 显示语言选择对话框，列出所有支持的语言
3. 用户选择新语言并点击确认
4. LanguageHelper 保存用户选择
5. Activity 自动重启以应用新语言
6. 所有使用 `getString(R.string.xxx)` 的地方自动显示新语言

## 注意事项 / Notes

1. **硬编码的字符串**：当前 MainActivity 中仍有大量硬编码的中文字符串。要完全支持多语言，需要将这些字符串逐步替换为 `getString(R.string.xxx)` 或 `R.string.xxx`。

2. **布局文件**：确保在 XML 布局文件中也使用 `@string/xxx` 引用，而不是直接写文本。

3. **动态文本**：对于需要插入变量的文本，使用格式化字符串：
   ```xml
   <string name="welcome_message">欢迎，%s！</string>
   ```
   ```java
   String message = getString(R.string.welcome_message, username);
   ```

4. **测试**：切换语言后，应用会自动重启。请确保测试所有页面的文本显示是否正常。

## 测试步骤 / Testing Steps

1. 运行应用
2. 进入"我的"页面
3. 点击语言设置按钮（或临时使用"我的收藏"按钮）
4. 选择不同的语言
5. 点击确认
6. 应用会重启并显示新语言
7. 检查各个页面的文本是否正确显示

## 下一步改进 / Next Steps for Improvement

1. **逐步迁移硬编码字符串**：将 MainActivity 和其他 Activity 中的硬编码中文字符串替换为字符串资源引用

2. **添加更多字符串资源**：当前只添加了最常用的字符串，需要添加更多字符串以覆盖所有文本

3. **更新布局文件**：确保所有 XML 布局文件中的文本都使用字符串资源引用

4. **添加语言切换动画**：优化语言切换时的用户体验

5. **持久化保存**：当前使用 SharedPreferences 保存语言选择，已经是持久化的

## 技术细节 / Technical Details

### 支持的 Android 版本
- 最低版本：根据项目的 minSdkVersion
- LanguageHelper 使用了 Android N (API 24) 的新 API，同时保持向后兼容

### 语言代码
- 中文：`zh`
- 英文：`en`
- 印尼语：`in`

### SharedPreferences 键
- 文件名：`language_prefs`
- 键名：`selected_language`

## 常见问题 / FAQ

**Q: 为什么语言切换后应用会重启？**
A: 这是 Android 应用语言切换的标准做法，因为需要重新加载所有资源以应用新语言。

**Q: 如何添加更多语言？**
A: 创建新的 `values-xx` 文件夹（xx 是语言代码），添加 strings.xml，然后在 LanguageHelper 中添加对应的语言代码。

**Q: 可以让某些页面保持中文吗？**
A: 可以，但不推荐。最好的做法是所有页面都支持多语言，以提供一致的用户体验。

## 联系与支持 / Contact & Support

如有问题，请查看代码中的注释或联系开发团队。
