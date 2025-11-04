package com.example.helloworldapp;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

/**
 * 首页 Tab 管理器
 * 负责处理首页的所有功能，包括：
 * - 公交信息显示
 * - 紧急服务（厕所、便利店、药店、银行）
 * - 附近推荐（推荐、美食、玩乐、景点）
 * - WiFi 连接按钮（实际连接逻辑保留在 MainActivity 或专门的 WiFi 管理器）
 */
public class HomeTabManager {
    private Activity activity;

    // UI 控件
    private ScrollView mainScrollView;
    private LinearLayout emergencyContent;
    private LinearLayout nearbyRecommendContent;

    // Tab 相关
    private LinearLayout tabToilet;
    private LinearLayout tabStore;
    private LinearLayout tabPharmacy;
    private LinearLayout tabBank;
    private TextView viewMoreServices;

    private TextView tabRecommend;
    private TextView tabFood;
    private TextView tabFun;
    private TextView tabScenic;

    private String currentEmergencyTab = "toilet";
    private String currentNearbyTab = "recommend";

    public HomeTabManager(Activity activity) {
        this.activity = activity;
    }

    /**
     * 初始化首页的所有控件
     */
    public void initialize() {
        mainScrollView = activity.findViewById(R.id.mainScrollView);
        emergencyContent = activity.findViewById(R.id.emergencyContent);
        nearbyRecommendContent = activity.findViewById(R.id.nearbyRecommendContent);

        // 紧急服务 Tab
        tabToilet = activity.findViewById(R.id.tabToilet);
        tabStore = activity.findViewById(R.id.tabStore);
        tabPharmacy = activity.findViewById(R.id.tabPharmacy);
        tabBank = activity.findViewById(R.id.tabBank);
        viewMoreServices = activity.findViewById(R.id.viewMoreServices);

        // 附近推荐 Tab
        tabRecommend = activity.findViewById(R.id.tabRecommend);
        tabFood = activity.findViewById(R.id.tabFood);
        tabFun = activity.findViewById(R.id.tabFun);
        tabScenic = activity.findViewById(R.id.tabScenic);

        setupClickListeners();

        // 加载初始内容
        switchEmergencyTab("toilet");
        switchNearbyTab("recommend");
    }

    /**
     * 显示首页
     */
    public void show() {
        if (mainScrollView != null) {
            mainScrollView.setVisibility(View.VISIBLE);
        }
    }

    /**
     * 隐藏首页
     */
    public void hide() {
        if (mainScrollView != null) {
            mainScrollView.setVisibility(View.GONE);
        }
    }

    /**
     * 设置点击事件
     */
    private void setupClickListeners() {
        // 紧急服务 Tab 切换
        if (tabToilet != null) {
            tabToilet.setOnClickListener(v -> switchEmergencyTab("toilet"));
        }
        if (tabStore != null) {
            tabStore.setOnClickListener(v -> switchEmergencyTab("store"));
        }
        if (tabPharmacy != null) {
            tabPharmacy.setOnClickListener(v -> switchEmergencyTab("pharmacy"));
        }
        if (tabBank != null) {
            tabBank.setOnClickListener(v -> switchEmergencyTab("bank"));
        }

        // 附近推荐 Tab 切换
        if (tabRecommend != null) {
            tabRecommend.setOnClickListener(v -> switchNearbyTab("recommend"));
        }
        if (tabFood != null) {
            tabFood.setOnClickListener(v -> switchNearbyTab("food"));
        }
        if (tabFun != null) {
            tabFun.setOnClickListener(v -> switchNearbyTab("fun"));
        }
        if (tabScenic != null) {
            tabScenic.setOnClickListener(v -> switchNearbyTab("scenic"));
        }
    }

    /**
     * 切换紧急服务 Tab
     */
    public void switchEmergencyTab(String tabType) {
        currentEmergencyTab = tabType;

        // 重置所有 Tab 背景
        resetEmergencyTabStyles();

        // 设置当前 Tab 样式
        LinearLayout activeTab = null;
        switch (tabType) {
            case "toilet":
                activeTab = tabToilet;
                loadEmergencyContent("toilet");
                break;
            case "store":
                activeTab = tabStore;
                loadEmergencyContent("store");
                break;
            case "pharmacy":
                activeTab = tabPharmacy;
                loadEmergencyContent("pharmacy");
                break;
            case "bank":
                activeTab = tabBank;
                loadEmergencyContent("bank");
                break;
        }

        if (activeTab != null) {
            activeTab.setBackgroundResource(R.drawable.tab_selected_background);
        }
    }

    /**
     * 重置紧急服务 Tab 样式
     */
    private void resetEmergencyTabStyles() {
        if (tabToilet != null) tabToilet.setBackgroundResource(R.drawable.tab_unselected_background);
        if (tabStore != null) tabStore.setBackgroundResource(R.drawable.tab_unselected_background);
        if (tabPharmacy != null) tabPharmacy.setBackgroundResource(R.drawable.tab_unselected_background);
        if (tabBank != null) tabBank.setBackgroundResource(R.drawable.tab_unselected_background);
    }

    /**
     * 加载紧急服务内容
     */
    private void loadEmergencyContent(String type) {
        if (emergencyContent == null) return;

        emergencyContent.removeAllViews();

        // 模拟数据
        String[] places = null;
        String[] distances = null;

        switch (type) {
            case "toilet":
                places = new String[]{
                    activity.getString(R.string.place_xinjiekou_metro),
                    activity.getString(R.string.place_deji_plaza),
                    activity.getString(R.string.place_central_mall)
                };
                distances = new String[]{"50m", "120m", "200m"};
                break;
            case "store":
                places = new String[]{
                    activity.getString(R.string.store_familymart),
                    activity.getString(R.string.store_711),
                    activity.getString(R.string.store_lawson)
                };
                distances = new String[]{"80m", "150m", "250m"};
                break;
            case "pharmacy":
                places = new String[]{
                    activity.getString(R.string.pharmacy_laobaixing),
                    activity.getString(R.string.pharmacy_yifeng),
                    activity.getString(R.string.pharmacy_guoyao)
                };
                distances = new String[]{"100m", "180m", "300m"};
                break;
            case "bank":
                places = new String[]{
                    activity.getString(R.string.bank_icbc_atm),
                    activity.getString(R.string.bank_ccb_atm),
                    activity.getString(R.string.bank_abc_atm)
                };
                distances = new String[]{"60m", "140m", "220m"};
                break;
        }

        if (places != null && distances != null) {
            for (int i = 0; i < places.length; i++) {
                View itemView = createServiceItem(places[i], distances[i]);
                emergencyContent.addView(itemView);
            }
        }
    }

    /**
     * 创建服务项视图
     */
    private View createServiceItem(String name, String distance) {
        LinearLayout item = new LinearLayout(activity);
        item.setOrientation(LinearLayout.HORIZONTAL);
        item.setPadding(16, 12, 16, 12);
        item.setLayoutParams(new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        ));

        TextView nameView = new TextView(activity);
        nameView.setText(name);
        nameView.setTextSize(14);
        nameView.setTextColor(0xFF333333);
        LinearLayout.LayoutParams nameParams = new LinearLayout.LayoutParams(
            0, LinearLayout.LayoutParams.WRAP_CONTENT, 1
        );
        nameView.setLayoutParams(nameParams);

        TextView distanceView = new TextView(activity);
        distanceView.setText(distance);
        distanceView.setTextSize(12);
        distanceView.setTextColor(0xFF999999);

        item.addView(nameView);
        item.addView(distanceView);

        return item;
    }

    /**
     * 切换附近推荐 Tab
     */
    public void switchNearbyTab(String tabType) {
        currentNearbyTab = tabType;

        // 重置所有 Tab 样式
        resetNearbyTabStyles();

        // 设置当前 Tab 样式和加载内容
        TextView activeTab = null;
        switch (tabType) {
            case "recommend":
                activeTab = tabRecommend;
                loadSmartRecommendation();
                break;
            case "food":
                activeTab = tabFood;
                loadFoodContent();
                break;
            case "fun":
                activeTab = tabFun;
                loadFunContent();
                break;
            case "scenic":
                activeTab = tabScenic;
                loadScenicContent();
                break;
        }

        if (activeTab != null) {
            activeTab.setTextColor(0xFF000000);
            activeTab.getPaint().setFakeBoldText(true);
            activeTab.getPaint().setUnderlineText(true);
            activeTab.invalidate();
        }
    }

    /**
     * 重置附近推荐 Tab 样式
     */
    private void resetNearbyTabStyles() {
        TextView[] tabs = {tabRecommend, tabFood, tabFun, tabScenic};
        for (TextView tab : tabs) {
            if (tab != null) {
                tab.setTextColor(0xFF999999);
                tab.getPaint().setFakeBoldText(false);
                tab.getPaint().setUnderlineText(false);
                tab.invalidate();
            }
        }
    }

    /**
     * 加载智能推荐内容
     */
    private void loadSmartRecommendation() {
        if (nearbyRecommendContent == null) return;
        nearbyRecommendContent.removeAllViews();

        // 模拟推荐数据
        addRecommendationCard(
            activity.getString(R.string.rec_deji_plaza),
            activity.getString(R.string.rec_deji_desc),
            "200m", "🏢",
            activity.getString(R.string.offer_200_minus_30)
        );
        addRecommendationCard(
            activity.getString(R.string.rec_laomendong),
            activity.getString(R.string.rec_laomendong_desc),
            "1.2km", "🏛️",
            activity.getString(R.string.offer_student_20off)
        );
        addRecommendationCard(
            activity.getString(R.string.rec_fuzi_temple),
            activity.getString(R.string.rec_fuzi_desc),
            "1.5km", "🍜", null
        );
    }

    /**
     * 加载美食内容
     */
    private void loadFoodContent() {
        if (nearbyRecommendContent == null) return;
        nearbyRecommendContent.removeAllViews();

        addRecommendationCard(
            activity.getString(R.string.rec_xiaolongbao),
            activity.getString(R.string.rec_xiaolongbao_desc),
            "150m", "🥟",
            activity.getString(R.string.offer_new_store_20off)
        );
        addRecommendationCard(
            activity.getString(R.string.rec_roast_duck),
            activity.getString(R.string.rec_roast_duck_desc),
            "300m", "🦆", null
        );
        addRecommendationCard(
            activity.getString(R.string.rec_haidilao),
            activity.getString(R.string.rec_haidilao_desc),
            "500m", "🍲",
            activity.getString(R.string.offer_student_discount)
        );
    }

    /**
     * 加载玩乐内容
     */
    private void loadFunContent() {
        if (nearbyRecommendContent == null) return;
        nearbyRecommendContent.removeAllViews();

        addRecommendationCard(
            activity.getString(R.string.rec_cinema),
            activity.getString(R.string.rec_cinema_desc),
            "400m", "🎬",
            activity.getString(R.string.offer_member_20off)
        );
        addRecommendationCard(
            activity.getString(R.string.rec_ktv),
            activity.getString(R.string.rec_ktv_desc),
            "600m", "🎤",
            activity.getString(R.string.offer_afternoon_50off)
        );
        addRecommendationCard(
            activity.getString(R.string.rec_escape_room),
            activity.getString(R.string.rec_escape_room_desc),
            "800m", "🔐", null
        );
    }

    /**
     * 加载景点内容
     */
    private void loadScenicContent() {
        if (nearbyRecommendContent == null) return;
        nearbyRecommendContent.removeAllViews();

        addRecommendationCard(
            activity.getString(R.string.rec_xuanwu_lake),
            activity.getString(R.string.rec_xuanwu_desc),
            "2km", "🌊",
            activity.getString(R.string.offer_free)
        );
        addRecommendationCard(
            activity.getString(R.string.rec_zhongshan_mausoleum),
            activity.getString(R.string.rec_zhongshan_desc),
            "8km", "⛰️",
            activity.getString(R.string.offer_free)
        );
        addRecommendationCard(
            activity.getString(R.string.rec_presidential_palace),
            activity.getString(R.string.rec_presidential_desc),
            "1km", "🏛️",
            activity.getString(R.string.offer_student_half)
        );
    }

    /**
     * 添加推荐卡片
     */
    private void addRecommendationCard(String title, String description, String distance,
                                      String emoji, String discount) {
        LinearLayout card = new LinearLayout(activity);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setBackgroundColor(0xFFFFFFFF);
        card.setPadding(16, 16, 16, 16);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        params.setMargins(0, 0, 0, 12);
        card.setLayoutParams(params);
        card.setElevation(2);

        // 标题行
        LinearLayout titleRow = new LinearLayout(activity);
        titleRow.setOrientation(LinearLayout.HORIZONTAL);
        titleRow.setLayoutParams(new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        ));

        TextView emojiView = new TextView(activity);
        emojiView.setText(emoji);
        emojiView.setTextSize(24);
        emojiView.setPadding(0, 0, 12, 0);

        TextView titleView = new TextView(activity);
        titleView.setText(title);
        titleView.setTextSize(16);
        titleView.setTextColor(0xFF000000);
        titleView.setTypeface(null, android.graphics.Typeface.BOLD);
        LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
            0, LinearLayout.LayoutParams.WRAP_CONTENT, 1
        );
        titleView.setLayoutParams(titleParams);

        TextView distanceView = new TextView(activity);
        distanceView.setText(distance);
        distanceView.setTextSize(12);
        distanceView.setTextColor(0xFF999999);

        titleRow.addView(emojiView);
        titleRow.addView(titleView);
        titleRow.addView(distanceView);

        // 描述
        TextView descView = new TextView(activity);
        descView.setText(description);
        descView.setTextSize(14);
        descView.setTextColor(0xFF666666);
        descView.setPadding(36, 8, 0, 0);

        card.addView(titleRow);
        card.addView(descView);

        // 优惠信息
        if (discount != null) {
            TextView discountView = new TextView(activity);
            discountView.setText("💰 " + discount);
            discountView.setTextSize(12);
            discountView.setTextColor(0xFFFF5722);
            discountView.setPadding(36, 8, 0, 0);
            card.addView(discountView);
        }

        nearbyRecommendContent.addView(card);
    }

    /**
     * 获取当前首页滚动视图
     */
    public ScrollView getMainScrollView() {
        return mainScrollView;
    }
}
