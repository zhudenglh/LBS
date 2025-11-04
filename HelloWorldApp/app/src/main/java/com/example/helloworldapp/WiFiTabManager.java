package com.example.helloworldapp;

import android.app.Activity;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

/**
 * WiFi Tab 管理器
 * 按照 jgw.png 设计实现
 * 简洁的 WiFi 连接界面
 */
public class WiFiTabManager {
    private Activity activity;

    // UI 控件
    private RelativeLayout wifiPage;
    private TextView wifiStatusTitle;
    private TextView wifiCountText;
    private Button btnQuickConnect;
    private LinearLayout btnFood;
    private LinearLayout btnGroupBuy;
    private LinearLayout btnTravel;
    private LinearLayout btnPhoneBoost;
    private LinearLayout btnMore;

    // 数据
    private int wifiCount = 33;
    private boolean isWifiConnected = false;

    public WiFiTabManager(Activity activity) {
        this.activity = activity;
    }

    /**
     * 初始化 WiFi Tab
     */
    public void initialize() {
        wifiPage = activity.findViewById(R.id.wifiPage);
        wifiStatusTitle = activity.findViewById(R.id.wifiStatusTitle);
        wifiCountText = activity.findViewById(R.id.wifiCountText);
        btnQuickConnect = activity.findViewById(R.id.btnQuickConnect);
        btnFood = activity.findViewById(R.id.btnFood);
        btnGroupBuy = activity.findViewById(R.id.btnGroupBuy);
        btnTravel = activity.findViewById(R.id.btnTravel);
        btnPhoneBoost = activity.findViewById(R.id.btnPhoneBoost);
        btnMore = activity.findViewById(R.id.btnMore);

        setupClickListeners();
        updateWifiStatus();
    }

    /**
     * 设置点击事件
     */
    private void setupClickListeners() {
        // 一键直连按钮
        if (btnQuickConnect != null) {
            btnQuickConnect.setOnClickListener(v -> quickConnectWifi());
        }

        // 功能图标
        if (btnFood != null) {
            btnFood.setOnClickListener(v -> {
                Toast.makeText(activity, "美食功能：查看附近美食推荐", Toast.LENGTH_SHORT).show();
            });
        }

        if (btnGroupBuy != null) {
            btnGroupBuy.setOnClickListener(v -> {
                Toast.makeText(activity, "团购功能：查看优惠团购", Toast.LENGTH_SHORT).show();
            });
        }

        if (btnTravel != null) {
            btnTravel.setOnClickListener(v -> {
                Toast.makeText(activity, "出行功能：查看交通路线", Toast.LENGTH_SHORT).show();
            });
        }

        if (btnPhoneBoost != null) {
            btnPhoneBoost.setOnClickListener(v -> {
                Toast.makeText(activity, "手机加速：优化网络连接", Toast.LENGTH_SHORT).show();
            });
        }

        if (btnMore != null) {
            btnMore.setOnClickListener(v -> {
                Toast.makeText(activity, "更多功能开发中", Toast.LENGTH_SHORT).show();
            });
        }
    }

    /**
     * 一键直连WiFi
     */
    private void quickConnectWifi() {
        if (isWifiConnected) {
            // 断开连接
            isWifiConnected = false;
            updateWifiStatus();
            Toast.makeText(activity, "WiFi已断开", Toast.LENGTH_SHORT).show();
            return;
        }

        Toast.makeText(activity, "正在连接最优WiFi...", Toast.LENGTH_SHORT).show();

        // 模拟连接
        new android.os.Handler().postDelayed(() -> {
            isWifiConnected = true;
            updateWifiStatus();
            Toast.makeText(activity, "WiFi连接成功！", Toast.LENGTH_SHORT).show();
        }, 1500);
    }

    /**
     * 更新WiFi状态
     */
    private void updateWifiStatus() {
        if (wifiStatusTitle == null || wifiCountText == null || btnQuickConnect == null) {
            return;
        }

        if (isWifiConnected) {
            wifiStatusTitle.setText("已连接WiFi");
            wifiCountText.setText("5路公交WiFi - 信号优秀");
            btnQuickConnect.setText("断开连接");
        } else {
            wifiStatusTitle.setText("当前未连接WiFi");
            wifiCountText.setText("附近有" + wifiCount + "个免费WiFi ▼");
            btnQuickConnect.setText("📶 一键直连");
        }
    }

    /**
     * 显示 WiFi Tab
     */
    public void show() {
        if (wifiPage != null) {
            wifiPage.setVisibility(View.VISIBLE);
            updateWifiStatus();
        }
    }

    /**
     * 隐藏 WiFi Tab
     */
    public void hide() {
        if (wifiPage != null) {
            wifiPage.setVisibility(View.GONE);
        }
    }

    /**
     * 获取 WiFi 页面
     */
    public RelativeLayout getWifiPage() {
        return wifiPage;
    }
}
