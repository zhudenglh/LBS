package com.example.helloworldapp;

import android.app.Activity;
import android.os.Handler;
import android.os.Looper;
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
    private LinearLayout locationSelector;
    private View searchContainer;
    private View scanButton;
    private LinearLayout featureTransit;
    private LinearLayout featureRebate;
    private LinearLayout featureHealth;
    private LinearLayout featureWallet;
    private Button busRemindButton;
    private View recommendMore;
    private View recommendCardOne;
    private View recommendCardTwo;

    // 数据
    private int wifiCount = 33;
    private boolean isWifiConnected = false;

    private final Handler handler = new Handler(Looper.getMainLooper());
    private Runnable connectRunnable;

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
        locationSelector = activity.findViewById(R.id.locationSelector);
        searchContainer = activity.findViewById(R.id.searchContainer);
        scanButton = activity.findViewById(R.id.scanButton);
        featureTransit = activity.findViewById(R.id.featureTransit);
        featureRebate = activity.findViewById(R.id.featureRebate);
        featureHealth = activity.findViewById(R.id.featureHealth);
        featureWallet = activity.findViewById(R.id.featureWallet);
        busRemindButton = activity.findViewById(R.id.busRemindButton);
        recommendMore = activity.findViewById(R.id.recommendMore);
        recommendCardOne = activity.findViewById(R.id.recommendCardOne);
        recommendCardTwo = activity.findViewById(R.id.recommendCardTwo);

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

        if (locationSelector != null) {
            locationSelector.setOnClickListener(v ->
                    Toast.makeText(activity, "城市切换功能开发中", Toast.LENGTH_SHORT).show());
        }

        if (searchContainer != null) {
            searchContainer.setOnClickListener(v ->
                    Toast.makeText(activity, "搜索功能开发中", Toast.LENGTH_SHORT).show());
        }

        if (scanButton != null) {
            scanButton.setOnClickListener(v ->
                    Toast.makeText(activity, "扫一扫功能开发中", Toast.LENGTH_SHORT).show());
        }

        if (featureTransit != null) {
            featureTransit.setOnClickListener(v ->
                    Toast.makeText(activity, "公交实时信息即将上线", Toast.LENGTH_SHORT).show());
        }

        if (featureRebate != null) {
            featureRebate.setOnClickListener(v ->
                    Toast.makeText(activity, "返利团优惠敬请期待", Toast.LENGTH_SHORT).show());
        }

        if (featureHealth != null) {
            featureHealth.setOnClickListener(v ->
                    Toast.makeText(activity, "小鹿健康功能开发中", Toast.LENGTH_SHORT).show());
        }

        if (featureWallet != null) {
            featureWallet.setOnClickListener(v ->
                    Toast.makeText(activity, "省钱包优惠准备中", Toast.LENGTH_SHORT).show());
        }

        if (busRemindButton != null) {
            busRemindButton.setOnClickListener(v ->
                    Toast.makeText(activity, "到站提醒已设置", Toast.LENGTH_SHORT).show());
        }

        if (recommendMore != null) {
            recommendMore.setOnClickListener(v ->
                    Toast.makeText(activity, "更多附近好店功能开发中", Toast.LENGTH_SHORT).show());
        }

        if (recommendCardOne != null) {
            recommendCardOne.setOnClickListener(v ->
                    Toast.makeText(activity, "抹茶面包优惠券即将发放", Toast.LENGTH_SHORT).show());
        }

        if (recommendCardTwo != null) {
            recommendCardTwo.setOnClickListener(v ->
                    Toast.makeText(activity, "奇奇甜品店老板娘欢迎您！", Toast.LENGTH_SHORT).show());
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
            if (connectRunnable != null) {
                handler.removeCallbacks(connectRunnable);
                connectRunnable = null;
            }
            return;
        }

        Toast.makeText(activity, "正在连接最优WiFi...", Toast.LENGTH_SHORT).show();

        // 模拟连接
        if (connectRunnable != null) {
            handler.removeCallbacks(connectRunnable);
        }
        connectRunnable = () -> {
            isWifiConnected = true;
            updateWifiStatus();
            Toast.makeText(activity, "WiFi连接成功！", Toast.LENGTH_SHORT).show();
            connectRunnable = null;
        };
        handler.postDelayed(connectRunnable, 1500);
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
            wifiCountText.setText("5路公交WiFi · 信号优秀");
            btnQuickConnect.setText("断开连接");
            btnQuickConnect.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, 0);
            btnQuickConnect.setBackgroundResource(R.drawable.bg_quick_disconnect);
            btnQuickConnect.setTextColor(activity.getColor(R.color.figma_brand_blue));
        } else {
            wifiStatusTitle.setText("当前未连接WiFi");
            wifiCountText.setText("附近有" + wifiCount + "个免费WiFi");
            btnQuickConnect.setText("一键直连");
            btnQuickConnect.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_wifi_signal, 0, 0, 0);
            btnQuickConnect.setBackgroundResource(R.drawable.bg_quick_connect);
            btnQuickConnect.setTextColor(activity.getColor(R.color.figma_text1));
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
        if (connectRunnable != null) {
            handler.removeCallbacks(connectRunnable);
            connectRunnable = null;
        }
    }

    public void cleanup() {
        if (connectRunnable != null) {
            handler.removeCallbacks(connectRunnable);
            connectRunnable = null;
        }
    }

    /**
     * 获取 WiFi 页面
     */
    public RelativeLayout getWifiPage() {
        return wifiPage;
    }
}
