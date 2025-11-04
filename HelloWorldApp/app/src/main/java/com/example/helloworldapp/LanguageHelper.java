package com.example.helloworldapp;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.os.Build;
import java.util.Locale;

/**
 * 语言管理工具类
 * 用于管理应用的多语言切换功能
 */
public class LanguageHelper {
    private static final String PREFS_NAME = "language_prefs";
    private static final String KEY_LANGUAGE = "selected_language";

    // 支持的语言代码
    public static final String LANGUAGE_CHINESE = "zh";
    public static final String LANGUAGE_ENGLISH = "en";
    public static final String LANGUAGE_INDONESIAN = "id"; // ISO 639-1 标准代码

    /**
     * 获取当前保存的语言设置
     */
    public static String getSavedLanguage(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        return prefs.getString(KEY_LANGUAGE, LANGUAGE_CHINESE); // 默认中文
    }

    /**
     * 保存语言设置
     */
    public static void saveLanguage(Context context, String languageCode) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().putString(KEY_LANGUAGE, languageCode).apply();
    }

    /**
     * 应用语言设置到Context
     */
    public static Context applyLanguage(Context context, String languageCode) {
        Locale locale;

        switch (languageCode) {
            case LANGUAGE_ENGLISH:
                locale = Locale.ENGLISH;
                break;
            case LANGUAGE_INDONESIAN:
                locale = new Locale("id"); // 使用标准ISO 639-1代码
                break;
            case LANGUAGE_CHINESE:
            default:
                locale = Locale.CHINESE;
                break;
        }

        Locale.setDefault(locale);

        Resources resources = context.getResources();
        Configuration configuration = new Configuration(resources.getConfiguration());

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            configuration.setLocale(locale);
            context = context.createConfigurationContext(configuration);
        } else {
            configuration.locale = locale;
            resources.updateConfiguration(configuration, resources.getDisplayMetrics());
        }

        return context;
    }

    /**
     * 切换语言并重启Activity
     */
    public static void changeLanguage(Activity activity, String languageCode) {
        // 保存语言选择
        saveLanguage(activity, languageCode);

        // 使用recreate()重启Activity，这样可以保留Activity状态
        // recreate()会自动调用attachBaseContext，应用新的语言设置
        activity.recreate();
    }

    /**
     * 获取语言显示名称
     */
    public static String getLanguageDisplayName(Context context, String languageCode) {
        switch (languageCode) {
            case LANGUAGE_ENGLISH:
                return context.getString(R.string.language_english);
            case LANGUAGE_INDONESIAN:
                return context.getString(R.string.language_indonesian);
            case LANGUAGE_CHINESE:
            default:
                return context.getString(R.string.language_chinese);
        }
    }

    /**
     * 获取所有支持的语言列表
     */
    public static String[] getSupportedLanguages() {
        return new String[]{
            LANGUAGE_CHINESE,
            LANGUAGE_ENGLISH,
            LANGUAGE_INDONESIAN
        };
    }

    /**
     * 检查是否为当前选择的语言
     */
    public static boolean isCurrentLanguage(Context context, String languageCode) {
        return getSavedLanguage(context).equals(languageCode);
    }
}
