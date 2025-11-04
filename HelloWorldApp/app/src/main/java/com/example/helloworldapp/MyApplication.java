package com.example.helloworldapp;

import android.app.Application;
import android.content.Context;

/**
 * 应用程序主类
 * 用于统一管理应用级别的配置，包括多语言设置
 */
public class MyApplication extends Application {

    @Override
    protected void attachBaseContext(Context base) {
        // 在应用启动时应用保存的语言设置
        // 这样可以确保所有Activity都使用正确的语言
        String languageCode = LanguageHelper.getSavedLanguage(base);
        Context context = LanguageHelper.applyLanguage(base, languageCode);
        super.attachBaseContext(context);
    }

    @Override
    public void onCreate() {
        super.onCreate();
        // 可以在这里初始化其他全局配置
    }
}
