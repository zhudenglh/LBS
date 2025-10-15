package com.example.helloworldapp;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.UUID;

public class UserManager {
    private static final String TAG = "UserManager";
    private static final String PREFS_NAME = "UserPrefs";
    private static final String KEY_USER_ID = "userId";
    private static final String KEY_NICKNAME = "nickname";
    private static final String KEY_AVATAR = "avatar";
    private static final String KEY_IS_FIRST_LAUNCH = "isFirstLaunch";

    private static final String BASE_URL = "http://101.37.70.167:3000/api";

    // 预设头像emoji池
    private static final String[] AVATAR_EMOJIS = {
        "🚌", "🚃", "🚊", "🚇", "🚉",
        "👨", "👩", "🧑", "👦", "👧",
        "🐶", "🐱", "🐻", "🐼", "🦁",
        "🌟", "⭐", "🌈", "🎈", "🎉"
    };

    // 预设昵称形容词池
    private static final String[] NICKNAME_ADJECTIVES = {
        "快乐的", "悠闲的", "勤奋的", "活力", "优雅的",
        "温暖的", "阳光", "追风的", "自由的", "梦想",
        "星空下的", "晨曦", "微笑的", "勇敢的", "智慧",
        "幸运的", "开心", "可爱的", "酷炫", "神秘"
    };

    // 预设昵称名词池
    private static final String[] NICKNAME_NOUNS = {
        "旅行者", "探索家", "冒险家", "行者", "追梦人",
        "车友", "乘客", "路人", "赶路人", "通勤侠",
        "城市漫步者", "公交达人", "地铁客", "晨间使者", "夜归人",
        "风行者", "流浪者", "奔跑者", "追光者", "寻梦人"
    };

    private Context context;
    private SharedPreferences prefs;

    public UserManager(Context context) {
        this.context = context.getApplicationContext();
        this.prefs = this.context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }

    /**
     * 检查是否首次启动
     */
    public boolean isFirstLaunch() {
        return prefs.getBoolean(KEY_IS_FIRST_LAUNCH, true);
    }

    /**
     * 设置首次启动标记
     */
    public void setFirstLaunchCompleted() {
        prefs.edit().putBoolean(KEY_IS_FIRST_LAUNCH, false).apply();
    }

    /**
     * 获取用户ID，如果不存在则生成新的
     */
    public String getUserId() {
        String userId = prefs.getString(KEY_USER_ID, null);
        if (userId == null) {
            userId = UUID.randomUUID().toString();
            prefs.edit().putString(KEY_USER_ID, userId).apply();
        }
        return userId;
    }

    /**
     * 获取昵称
     */
    public String getNickname() {
        return prefs.getString(KEY_NICKNAME, null);
    }

    /**
     * 获取头像
     */
    public String getAvatar() {
        return prefs.getString(KEY_AVATAR, null);
    }

    /**
     * 生成随机昵称（形容词+名词）
     */
    public String generateRandomNickname() {
        String adjective = NICKNAME_ADJECTIVES[(int)(Math.random() * NICKNAME_ADJECTIVES.length)];
        String noun = NICKNAME_NOUNS[(int)(Math.random() * NICKNAME_NOUNS.length)];
        return adjective + noun;
    }

    /**
     * 检查昵称是否存在（从服务器）
     */
    public boolean isNicknameExists(String nickname) {
        try {
            URL url = new URL(BASE_URL + "/users/check-nickname?nickname=" + java.net.URLEncoder.encode(nickname, "UTF-8"));
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);

            int responseCode = conn.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();

                JSONObject jsonResponse = new JSONObject(response.toString());
                boolean exists = jsonResponse.getBoolean("exists");
                conn.disconnect();
                return exists;
            }
            conn.disconnect();
        } catch (Exception e) {
            Log.e(TAG, "检查昵称失败: " + e.getMessage());
        }
        return false; // 如果检查失败，默认不存在
    }

    /**
     * 生成唯一的随机昵称（确保不重复）
     */
    public String generateUniqueNickname() {
        String nickname;
        int attempts = 0;
        int maxAttempts = 20; // 最多尝试20次

        do {
            nickname = generateRandomNickname();
            attempts++;

            // 如果超过最大尝试次数，添加数字后缀确保唯一性
            if (attempts >= maxAttempts) {
                int number = (int)(Math.random() * 900) + 100; // 100-999
                nickname = nickname + number;
                break;
            }
        } while (isNicknameExists(nickname));

        return nickname;
    }

    /**
     * 生成随机头像
     */
    public String generateRandomAvatar() {
        return AVATAR_EMOJIS[(int)(Math.random() * AVATAR_EMOJIS.length)];
    }

    /**
     * 保存用户信息到本地
     */
    public void saveUserInfo(String nickname, String avatar) {
        prefs.edit()
            .putString(KEY_NICKNAME, nickname)
            .putString(KEY_AVATAR, avatar)
            .apply();

        Log.d(TAG, "用户信息已保存到本地: " + nickname + " " + avatar);
    }

    /**
     * 同步用户信息到服务器
     */
    public void syncToServer(SyncCallback callback) {
        new Thread(() -> {
            try {
                String userId = getUserId();
                String nickname = getNickname();
                String avatar = getAvatar();

                if (nickname == null || avatar == null) {
                    if (callback != null) {
                        callback.onFailure("用户信息不完整");
                    }
                    return;
                }

                URL url = new URL(BASE_URL + "/users");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();

                conn.setDoOutput(true);
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");

                // 构建 JSON 请求体
                JSONObject jsonBody = new JSONObject();
                jsonBody.put("userId", userId);
                jsonBody.put("nickname", nickname);
                jsonBody.put("avatar", avatar);

                // 发送请求
                OutputStream os = conn.getOutputStream();
                os.write(jsonBody.toString().getBytes("UTF-8"));
                os.close();

                // 读取响应
                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    Log.d(TAG, "用户信息已同步到服务器");
                    if (callback != null) {
                        callback.onSuccess();
                    }
                } else {
                    BufferedReader errorReader = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
                    StringBuilder errorResponse = new StringBuilder();
                    String line;
                    while ((line = errorReader.readLine()) != null) {
                        errorResponse.append(line);
                    }
                    errorReader.close();
                    String errorMsg = errorResponse.toString();
                    Log.e(TAG, "同步用户信息失败: " + errorMsg);
                    throw new Exception("同步失败 (HTTP " + responseCode + "): " + errorMsg);
                }

                conn.disconnect();

            } catch (Exception e) {
                Log.e(TAG, "同步用户信息失败: " + e.getMessage());
                e.printStackTrace();
                if (callback != null) {
                    callback.onFailure(e.getMessage());
                }
            }
        }).start();
    }

    /**
     * 初始化新用户（生成随机信息）
     */
    public void initializeNewUser() {
        String nickname = generateUniqueNickname();
        String avatar = generateRandomAvatar();
        saveUserInfo(nickname, avatar);
    }

    /**
     * 检查是否有用户信息
     */
    public boolean hasUserInfo() {
        return getNickname() != null && getAvatar() != null;
    }

    public interface SyncCallback {
        void onSuccess();
        void onFailure(String error);
    }
}
