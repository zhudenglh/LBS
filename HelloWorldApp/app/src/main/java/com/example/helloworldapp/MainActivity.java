package com.example.helloworldapp;

import android.app.Activity;
import android.app.Dialog;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.HorizontalScrollView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends Activity {
    private LinearLayout navHome;
    private LinearLayout navDiscover;
    private LinearLayout navFavorite;
    private LinearLayout navProfile;
    private RelativeLayout floatingButton;
    private Button wifiButton;
    private TextView transferDetailButton;
    private LinearLayout busMoreButton;
    private LinearLayout tabToilet;
    private LinearLayout tabStore;
    private LinearLayout tabPharmacy;
    private LinearLayout tabBank;
    private TextView viewMoreServices;
    private LinearLayout emergencyContent;
    private TextView tabRecommend;
    private TextView tabFood;
    private TextView tabFun;
    private TextView tabScenic;
    private TextView tabService;
    private LinearLayout nearbyRecommendContent;
    private Toast customToast;
    private boolean isConnected = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 显示WiFi连接弹窗
        showWifiDialog();

        // 初始化控件
        navHome = findViewById(R.id.navHome);
        navDiscover = findViewById(R.id.navDiscover);
        navFavorite = findViewById(R.id.navFavorite);
        navProfile = findViewById(R.id.navProfile);
        floatingButton = findViewById(R.id.floatingButton);
        wifiButton = findViewById(R.id.wifiButton);
        transferDetailButton = findViewById(R.id.transferDetailButton);
        busMoreButton = findViewById(R.id.busMoreButton);
        tabToilet = findViewById(R.id.tabToilet);
        tabStore = findViewById(R.id.tabStore);
        tabPharmacy = findViewById(R.id.tabPharmacy);
        tabBank = findViewById(R.id.tabBank);
        viewMoreServices = findViewById(R.id.viewMoreServices);
        emergencyContent = findViewById(R.id.emergencyContent);
        tabRecommend = findViewById(R.id.tabRecommend);
        tabFood = findViewById(R.id.tabFood);
        tabFun = findViewById(R.id.tabFun);
        tabScenic = findViewById(R.id.tabScenic);
        tabService = findViewById(R.id.tabService);
        nearbyRecommendContent = findViewById(R.id.nearbyRecommendContent);

        // WiFi按钮点击事件
        wifiButton.setOnClickListener(v -> {
            if (!isConnected) {
                // 显示连接中Toast
                showConnectingToast();

                // 2秒后关闭Toast并更新按钮
                new Handler().postDelayed(() -> {
                    if (customToast != null) {
                        customToast.cancel();
                    }
                    isConnected = true;
                    wifiButton.setText("已连接");
                    wifiButton.setBackgroundResource(R.drawable.button_rounded_green);
                    wifiButton.setTextColor(0xFFFFFFFF); // 白色文字
                    Toast.makeText(MainActivity.this, "WiFi连接成功", Toast.LENGTH_SHORT).show();
                }, 2000);
            } else {
                showWifiStatusDialog();
            }
        });

        // 底部导航点击事件
        navHome.setOnClickListener(v ->
            Toast.makeText(this, "首页", Toast.LENGTH_SHORT).show()
        );

        navDiscover.setOnClickListener(v ->
            Toast.makeText(this, "发现", Toast.LENGTH_SHORT).show()
        );

        navFavorite.setOnClickListener(v ->
            Toast.makeText(this, "收藏", Toast.LENGTH_SHORT).show()
        );

        navProfile.setOnClickListener(v ->
            Toast.makeText(this, "我的", Toast.LENGTH_SHORT).show()
        );

        // 悬浮按钮点击事件
        floatingButton.setOnClickListener(v -> showCouponsDialog());

        // 换乘详细信息按钮点击事件
        transferDetailButton.setOnClickListener(v -> showTransferDetailDialog(false));

        // 公交更多按钮点击事件
        busMoreButton.setOnClickListener(v -> showTransferDetailDialog(true));

        // 应急服务tab点击事件
        tabToilet.setOnClickListener(v -> switchEmergencyTab("toilet"));
        tabStore.setOnClickListener(v -> switchEmergencyTab("store"));
        tabPharmacy.setOnClickListener(v -> switchEmergencyTab("pharmacy"));
        tabBank.setOnClickListener(v -> switchEmergencyTab("bank"));

        // 查看更多服务
        viewMoreServices.setOnClickListener(v -> {
            Intent intent = new Intent(MainActivity.this, ServiceDetailActivity.class);
            startActivity(intent);
        });

        // 附近推荐tab点击事件
        tabRecommend.setOnClickListener(v -> switchNearbyTab("recommend"));
        tabFood.setOnClickListener(v -> switchNearbyTab("food"));
        tabFun.setOnClickListener(v -> switchNearbyTab("fun"));
        tabScenic.setOnClickListener(v -> switchNearbyTab("scenic"));
        tabService.setOnClickListener(v -> switchNearbyTab("service"));

        // 启动行进箭头动画
        View movingArrow = findViewById(R.id.movingArrow);
        Animation arrowAnimation = AnimationUtils.loadAnimation(this, R.anim.arrow_move);
        movingArrow.startAnimation(arrowAnimation);

        // 启动下一站圆圈动画
        View nextStationCircle = findViewById(R.id.nextStationCircle);
        Animation rippleAnimation = AnimationUtils.loadAnimation(this, R.anim.ripple_expand);
        nextStationCircle.startAnimation(rippleAnimation);

        // 滚动到当前站点显示在偏左侧
        HorizontalScrollView scrollView = findViewById(R.id.stationScrollView);
        scrollView.post(() -> {
            // 计算当前站点位置（中山陵在第3个位置，200dp位置）
            // 让中山陵显示在屏幕左侧1/3位置
            int screenWidth = getResources().getDisplayMetrics().widthPixels;
            int stationPosition = (int) (200 * getResources().getDisplayMetrics().density);
            int scrollX = stationPosition - (screenWidth / 3);
            scrollView.scrollTo(Math.max(0, scrollX), 0);
        });

        // 初始化附近推荐（默认显示推荐tab）
        switchNearbyTab("recommend");
    }

    private void showConnectingToast() {
        LayoutInflater inflater = getLayoutInflater();
        View layout = inflater.inflate(R.layout.custom_toast, null);

        customToast = new Toast(getApplicationContext());
        customToast.setGravity(Gravity.CENTER, 0, 0);
        customToast.setDuration(Toast.LENGTH_SHORT);
        customToast.setView(layout);
        customToast.show();
    }

    private void showCouponsDialog() {
        Dialog dialog = new Dialog(this, android.R.style.Theme_Translucent_NoTitleBar);
        dialog.setContentView(R.layout.dialog_coupons);

        // 设置对话框全屏
        Window window = dialog.getWindow();
        if (window != null) {
            window.setLayout(
                RelativeLayout.LayoutParams.MATCH_PARENT,
                RelativeLayout.LayoutParams.MATCH_PARENT
            );
            window.setBackgroundDrawableResource(android.R.color.transparent);
            window.getAttributes().windowAnimations = R.style.BottomSheetAnimation;
        }

        // 获取底部弹出内容
        View bottomSheetContent = dialog.findViewById(R.id.bottomSheetContent);

        // 设置底部内容高度为屏幕的2/3
        int screenHeight = getResources().getDisplayMetrics().heightPixels;
        RelativeLayout.LayoutParams params = (RelativeLayout.LayoutParams) bottomSheetContent.getLayoutParams();
        params.height = (int) (screenHeight * 0.67);
        bottomSheetContent.setLayoutParams(params);

        // 关闭按钮
        TextView closeButton = dialog.findViewById(R.id.closeDialog);
        closeButton.setOnClickListener(v -> dialog.dismiss());

        // 点击背景关闭
        View dimBackground = dialog.findViewById(R.id.dimBackground);
        dimBackground.setOnClickListener(v -> dialog.dismiss());

        dialog.show();
    }

    private void showWifiStatusDialog() {
        Dialog dialog = new Dialog(this);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.dialog_wifi_status);

        // 设置对话框宽度
        Window window = dialog.getWindow();
        if (window != null) {
            window.setLayout(
                (int) (getResources().getDisplayMetrics().widthPixels * 0.85),
                RelativeLayout.LayoutParams.WRAP_CONTENT
            );
            window.setBackgroundDrawableResource(android.R.color.transparent);
        }

        // 取消按钮
        Button cancelButton = dialog.findViewById(R.id.cancelButton);
        cancelButton.setOnClickListener(v -> dialog.dismiss());

        // 断开连接按钮
        Button disconnectButton = dialog.findViewById(R.id.disconnectButton);
        disconnectButton.setOnClickListener(v -> {
            isConnected = false;
            wifiButton.setText("连接WiFi");
            wifiButton.setBackgroundResource(R.drawable.button_rounded);
            wifiButton.setTextColor(0xFF000000); // 黑色文字
            Toast.makeText(MainActivity.this, "WiFi已断开", Toast.LENGTH_SHORT).show();
            dialog.dismiss();
        });

        dialog.show();
    }

    private void showTransferDetailDialog(boolean scrollToBus) {
        Dialog dialog = new Dialog(this, android.R.style.Theme_Translucent_NoTitleBar);
        dialog.setContentView(R.layout.dialog_transfer_detail);

        // 设置对话框全屏
        Window window = dialog.getWindow();
        if (window != null) {
            window.setLayout(
                RelativeLayout.LayoutParams.MATCH_PARENT,
                RelativeLayout.LayoutParams.MATCH_PARENT
            );
            window.setBackgroundDrawableResource(android.R.color.transparent);
            window.getAttributes().windowAnimations = R.style.BottomSheetAnimation;
        }

        // 获取底部弹出内容
        ScrollView bottomSheetContent = (ScrollView) dialog.findViewById(R.id.bottomSheetTransfer);

        // 强制设置底部内容高度为屏幕的2/3
        int screenHeight = getResources().getDisplayMetrics().heightPixels;
        int targetHeight = (int) (screenHeight * 0.67);
        RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(
            RelativeLayout.LayoutParams.MATCH_PARENT,
            targetHeight
        );
        params.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
        bottomSheetContent.setLayoutParams(params);

        // 关闭按钮
        TextView closeButton = dialog.findViewById(R.id.closeTransferDialog);
        closeButton.setOnClickListener(v -> dialog.dismiss());

        // 点击背景关闭
        View dimBackground = dialog.findViewById(R.id.dimBackgroundTransfer);
        dimBackground.setOnClickListener(v -> dialog.dismiss());

        // 如果需要滚动到公交部分
        if (scrollToBus) {
            bottomSheetContent.post(() -> {
                View busSection = dialog.findViewById(R.id.busTransferSection);
                if (busSection != null) {
                    bottomSheetContent.smoothScrollTo(0, busSection.getTop());
                }
            });
        }

        dialog.show();
    }

    private void switchEmergencyTab(String tabType) {
        // 重置所有tab样式
        tabToilet.setBackgroundResource(R.drawable.tab_unselected_background);
        tabStore.setBackgroundResource(R.drawable.tab_unselected_background);
        tabPharmacy.setBackgroundResource(R.drawable.tab_unselected_background);
        tabBank.setBackgroundResource(R.drawable.tab_unselected_background);

        TextView toiletText = findViewById(R.id.tabToiletText);
        TextView storeText = findViewById(R.id.tabStoreText);
        TextView pharmacyText = findViewById(R.id.tabPharmacyText);
        TextView bankText = findViewById(R.id.tabBankText);

        toiletText.setTextColor(0xFF666666);
        storeText.setTextColor(0xFF666666);
        pharmacyText.setTextColor(0xFF666666);
        bankText.setTextColor(0xFF666666);

        // 清空内容
        emergencyContent.removeAllViews();

        // 根据tab类型设置选中样式并显示对应内容
        LayoutInflater inflater = getLayoutInflater();
        View contentView;

        switch (tabType) {
            case "toilet":
                tabToilet.setBackgroundResource(R.drawable.tab_selected_background);
                toiletText.setTextColor(0xFF000000);
                contentView = createToiletContent();
                break;
            case "store":
                tabStore.setBackgroundResource(R.drawable.tab_selected_background);
                storeText.setTextColor(0xFF000000);
                contentView = createStoreContent();
                break;
            case "pharmacy":
                tabPharmacy.setBackgroundResource(R.drawable.tab_selected_background);
                pharmacyText.setTextColor(0xFF000000);
                contentView = createPharmacyContent();
                break;
            case "bank":
                tabBank.setBackgroundResource(R.drawable.tab_selected_background);
                bankText.setTextColor(0xFF000000);
                contentView = createBankContent();
                break;
            default:
                contentView = createToiletContent();
        }

        emergencyContent.addView(contentView);
    }

    private View createToiletContent() {
        LayoutInflater inflater = getLayoutInflater();
        return inflater.inflate(R.layout.content_toilet, emergencyContent, false);
    }

    private View createStoreContent() {
        LayoutInflater inflater = getLayoutInflater();
        return inflater.inflate(R.layout.content_store, emergencyContent, false);
    }

    private View createPharmacyContent() {
        LayoutInflater inflater = getLayoutInflater();
        return inflater.inflate(R.layout.content_pharmacy, emergencyContent, false);
    }

    private View createBankContent() {
        LayoutInflater inflater = getLayoutInflater();
        return inflater.inflate(R.layout.content_bank, emergencyContent, false);
    }

    private void showMoreServicesDialog() {
        Dialog dialog = new Dialog(this, android.R.style.Theme_Translucent_NoTitleBar);
        dialog.setContentView(R.layout.dialog_more_services);

        // 设置对话框全屏
        Window window = dialog.getWindow();
        if (window != null) {
            window.setLayout(
                RelativeLayout.LayoutParams.MATCH_PARENT,
                RelativeLayout.LayoutParams.MATCH_PARENT
            );
            window.setBackgroundDrawableResource(android.R.color.transparent);
            window.getAttributes().windowAnimations = R.style.BottomSheetAnimation;
        }

        // 获取底部弹出内容
        ScrollView bottomSheetContent = (ScrollView) dialog.findViewById(R.id.bottomSheetServices);

        // 设置底部内容高度为屏幕的2/3
        int screenHeight = getResources().getDisplayMetrics().heightPixels;
        int targetHeight = (int) (screenHeight * 0.67);
        RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(
            RelativeLayout.LayoutParams.MATCH_PARENT,
            targetHeight
        );
        params.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
        bottomSheetContent.setLayoutParams(params);

        // 关闭按钮
        TextView closeButton = dialog.findViewById(R.id.closeServicesDialog);
        closeButton.setOnClickListener(v -> dialog.dismiss());

        // 点击背景关闭
        View dimBackground = dialog.findViewById(R.id.dimBackgroundServices);
        dimBackground.setOnClickListener(v -> dialog.dismiss());

        // 设置各服务点击事件
        LinearLayout serviceRestaurant = dialog.findViewById(R.id.serviceRestaurant);
        LinearLayout serviceExpress = dialog.findViewById(R.id.serviceExpress);
        LinearLayout serviceRepair = dialog.findViewById(R.id.serviceRepair);
        LinearLayout serviceParking = dialog.findViewById(R.id.serviceParking);
        LinearLayout serviceHospital = dialog.findViewById(R.id.serviceHospital);
        LinearLayout serviceFitness = dialog.findViewById(R.id.serviceFitness);
        LinearLayout serviceEducation = dialog.findViewById(R.id.serviceEducation);
        LinearLayout serviceBeauty = dialog.findViewById(R.id.serviceBeauty);

        serviceRestaurant.setOnClickListener(v -> {
            dialog.dismiss();
            showServiceDetail("restaurant");
        });
        serviceExpress.setOnClickListener(v -> {
            dialog.dismiss();
            showServiceDetail("express");
        });
        serviceRepair.setOnClickListener(v -> {
            dialog.dismiss();
            showServiceDetail("repair");
        });
        serviceParking.setOnClickListener(v -> {
            dialog.dismiss();
            showServiceDetail("parking");
        });
        serviceHospital.setOnClickListener(v -> {
            dialog.dismiss();
            Toast.makeText(this, "医院服务开发中", Toast.LENGTH_SHORT).show();
        });
        serviceFitness.setOnClickListener(v -> {
            dialog.dismiss();
            Toast.makeText(this, "健身服务开发中", Toast.LENGTH_SHORT).show();
        });
        serviceEducation.setOnClickListener(v -> {
            dialog.dismiss();
            Toast.makeText(this, "教育服务开发中", Toast.LENGTH_SHORT).show();
        });
        serviceBeauty.setOnClickListener(v -> {
            dialog.dismiss();
            Toast.makeText(this, "美发服务开发中", Toast.LENGTH_SHORT).show();
        });

        dialog.show();
    }

    private void showServiceDetail(String serviceType) {
        Toast.makeText(this, "查看" + getServiceName(serviceType) + "详情", Toast.LENGTH_SHORT).show();
    }

    private String getServiceName(String serviceType) {
        switch (serviceType) {
            case "restaurant": return "餐饮";
            case "express": return "快递";
            case "repair": return "维修";
            case "parking": return "停车";
            default: return "服务";
        }
    }

    private View createRestaurantContent() {
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);

        TextView title = new TextView(this);
        title.setText("📍 附近餐饮");
        title.setTextSize(15);
        title.setTextColor(0xFF000000);
        title.setPadding(0, 0, 0, (int)(12 * getResources().getDisplayMetrics().density));
        layout.addView(title);

        layout.addView(createServiceCard("肯德基(大行宫店)", "距离60米  |  步行约1分钟  |  快餐", "查看"));
        layout.addView(createServiceCard("星巴克咖啡", "距离95米  |  步行约2分钟  |  咖啡", "查看"));
        layout.addView(createServiceCard("南京大牌档", "距离150米  |  步行约2分钟  |  本帮菜", "查看"));

        return layout;
    }

    private View createExpressContent() {
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);

        TextView title = new TextView(this);
        title.setText("📍 快递服务点");
        title.setTextSize(15);
        title.setTextColor(0xFF000000);
        title.setPadding(0, 0, 0, (int)(12 * getResources().getDisplayMetrics().density));
        layout.addView(title);

        layout.addView(createServiceCard("菜鸟驿站(大行宫站)", "距离70米  |  步行约1分钟  |  营业中", "导航"));
        layout.addView(createServiceCard("顺丰速运(新街口网点)", "距离140米  |  步行约2分钟  |  营业中", "导航"));
        layout.addView(createServiceCard("京东快递自提点", "距离180米  |  步行约3分钟  |  营业中", "导航"));

        return layout;
    }

    private View createRepairContent() {
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);

        TextView title = new TextView(this);
        title.setText("📍 维修服务");
        title.setTextSize(15);
        title.setTextColor(0xFF000000);
        title.setPadding(0, 0, 0, (int)(12 * getResources().getDisplayMetrics().density));
        layout.addView(title);

        layout.addView(createServiceCard("手机维修(闪修侠)", "距离85米  |  步行约2分钟  |  手机维修", "预约"));
        layout.addView(createServiceCard("家电维修服务中心", "距离160米  |  步行约3分钟  |  家电维修", "预约"));
        layout.addView(createServiceCard("电脑维修(百邦)", "距离200米  |  步行约3分钟  |  电脑维修", "预约"));

        return layout;
    }

    private View createParkingContent() {
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);

        TextView title = new TextView(this);
        title.setText("📍 附近停车场");
        title.setTextSize(15);
        title.setTextColor(0xFF000000);
        title.setPadding(0, 0, 0, (int)(12 * getResources().getDisplayMetrics().density));
        layout.addView(title);

        layout.addView(createServiceCard("大行宫地铁停车场", "距离50米  |  空余车位：23个  |  ¥5/小时", "导航"));
        layout.addView(createServiceCard("德基广场地下停车库", "距离120米  |  空余车位：56个  |  ¥6/小时", "导航"));
        layout.addView(createServiceCard("新街口中心停车场", "距离200米  |  空余车位：12个  |  ¥8/小时", "导航"));

        return layout;
    }

    private View createServiceCard(String name, String info, String buttonText) {
        float density = getResources().getDisplayMetrics().density;

        RelativeLayout card = new RelativeLayout(this);
        card.setBackgroundColor(0xFFFFFFFF);
        card.setPadding((int)(14*density), (int)(14*density), (int)(14*density), (int)(14*density));
        LinearLayout.LayoutParams cardParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        cardParams.bottomMargin = (int)(8*density);
        card.setLayoutParams(cardParams);

        LinearLayout textLayout = new LinearLayout(this);
        textLayout.setOrientation(LinearLayout.VERTICAL);
        RelativeLayout.LayoutParams textParams = new RelativeLayout.LayoutParams(
            RelativeLayout.LayoutParams.MATCH_PARENT,
            RelativeLayout.LayoutParams.WRAP_CONTENT
        );
        textParams.addRule(RelativeLayout.CENTER_VERTICAL);
        textParams.rightMargin = (int)(72*density);
        textLayout.setLayoutParams(textParams);

        TextView nameView = new TextView(this);
        nameView.setText(name);
        nameView.setTextSize(15);
        nameView.setTextColor(0xFF000000);
        textLayout.addView(nameView);

        TextView infoView = new TextView(this);
        infoView.setText(info);
        infoView.setTextSize(12);
        infoView.setTextColor(0xFF999999);
        LinearLayout.LayoutParams infoParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        infoParams.topMargin = (int)(6*density);
        infoView.setLayoutParams(infoParams);
        textLayout.addView(infoView);

        TextView button = new TextView(this);
        button.setText(buttonText);
        button.setTextSize(13);
        button.setTextColor(0xFF000000);
        button.setGravity(android.view.Gravity.CENTER);
        button.setBackgroundResource(R.drawable.button_rounded);
        RelativeLayout.LayoutParams buttonParams = new RelativeLayout.LayoutParams(
            (int)(60*density),
            (int)(32*density)
        );
        buttonParams.addRule(RelativeLayout.ALIGN_PARENT_END);
        buttonParams.addRule(RelativeLayout.CENTER_VERTICAL);
        button.setLayoutParams(buttonParams);

        card.addView(textLayout);
        card.addView(button);

        return card;
    }

    // 切换附近推荐tab
    private void switchNearbyTab(String tabType) {
        // 重置所有tab样式
        tabRecommend.setBackgroundResource(R.drawable.tab_unselected_background);
        tabRecommend.setTextColor(0xFF666666);
        tabFood.setBackgroundResource(R.drawable.tab_unselected_background);
        tabFood.setTextColor(0xFF666666);
        tabFun.setBackgroundResource(R.drawable.tab_unselected_background);
        tabFun.setTextColor(0xFF666666);
        tabScenic.setBackgroundResource(R.drawable.tab_unselected_background);
        tabScenic.setTextColor(0xFF666666);
        tabService.setBackgroundResource(R.drawable.tab_unselected_background);
        tabService.setTextColor(0xFF666666);

        // 清空内容
        nearbyRecommendContent.removeAllViews();

        // 根据tab类型加载不同内容
        if (tabType.equals("recommend")) {
            tabRecommend.setBackgroundResource(R.drawable.tab_selected_background);
            tabRecommend.setTextColor(0xFF000000);
            loadSmartRecommendation();
        } else if (tabType.equals("food")) {
            tabFood.setBackgroundResource(R.drawable.tab_selected_background);
            tabFood.setTextColor(0xFF000000);
            loadFoodContent();
        } else if (tabType.equals("fun")) {
            tabFun.setBackgroundResource(R.drawable.tab_selected_background);
            tabFun.setTextColor(0xFF000000);
            loadFunContent();
        } else if (tabType.equals("scenic")) {
            tabScenic.setBackgroundResource(R.drawable.tab_selected_background);
            tabScenic.setTextColor(0xFF000000);
            loadScenicContent();
        } else if (tabType.equals("service")) {
            tabService.setBackgroundResource(R.drawable.tab_selected_background);
            tabService.setTextColor(0xFF000000);
            loadNearbyPeopleContent();
        }
    }

    // 加载智能推荐内容
    private void loadSmartRecommendation() {
        LinearLayout contentLayout = nearbyRecommendContent;

        // 获取当前时间
        java.util.Calendar calendar = java.util.Calendar.getInstance();
        int hour = calendar.get(java.util.Calendar.HOUR_OF_DAY);

        String timeText;
        String[][] recommendations;

        // 根据时间段推荐不同内容
        if (hour >= 6 && hour < 9) {
            // 早餐时间 (6:00-9:00)
            timeText = "早餐时间";
            recommendations = new String[][] {
                {"金陵早点铺", "特色小笼包、鸭血粉丝汤", "距离150米  |  步行约2分钟", "🥟", "减5元"},
                {"星巴克(新街口店)", "美式咖啡、三明治套餐", "距离200米  |  步行约3分钟", "☕", "8折"},
                {"玄武湖晨练区", "适合晨跑、太极拳", "距离500米  |  步行约7分钟", "🏃", "免费"}
            };
        } else if (hour >= 9 && hour < 11) {
            // 上午 (9:00-11:00)
            timeText = "上午推荐";
            recommendations = new String[][] {
                {"瑞幸咖啡", "提神醒脑，开启美好一天", "距离120米  |  步行约2分钟", "☕", "第2杯5折"},
                {"先锋书店", "文艺打卡圣地", "距离800米  |  步行约10分钟", "📚", "9折"},
                {"新街口健身房", "晨间健身优惠", "距离300米  |  步行约4分钟", "💪", "99元"}
            };
        } else if (hour >= 11 && hour < 14) {
            // 午餐时间 (11:00-14:00)
            timeText = "午餐时间";
            recommendations = new String[][] {
                {"南京大排档", "正宗金陵菜、盐水鸭", "距离300米  |  步行约4分钟", "🍜", "新客优惠"},
                {"和府捞面", "招牌牛肉面、小菜", "距离180米  |  步行约2分钟", "🍜", "立减10元"},
                {"汉堡王", "快捷美味，套餐优惠", "距离220米  |  步行约3分钟", "🍔", "59元任选10件"}
            };
        } else if (hour >= 14 && hour < 17) {
            // 下午茶时间 (14:00-17:00)
            timeText = "下午茶时间";
            recommendations = new String[][] {
                {"面包新语", "精美蛋糕、奶茶", "距离160米  |  步行约2分钟", "🍰", "买1送1"},
                {"喜茶", "芝士奶盖、水果茶", "距离250米  |  步行约3分钟", "🧋", "9折"},
                {"COSTA咖啡", "惬意午后时光", "距离280米  |  步行约4分钟", "☕", "49元"}
            };
        } else if (hour >= 17 && hour < 20) {
            // 晚餐时间 (17:00-20:00)
            timeText = "晚餐时间";
            recommendations = new String[][] {
                {"海底捞火锅", "经典川味火锅", "距离400米  |  步行约5分钟", "🍲", "8.8折"},
                {"外婆家", "江浙菜、性价比高", "距离350米  |  步行约5分钟", "🍱", "免排队"},
                {"必胜客", "披萨、意面套餐", "距离280米  |  步行约4分钟", "🍕", "99元"}
            };
        } else {
            // 夜宵和娱乐 (20:00-6:00)
            timeText = "夜宵娱乐";
            recommendations = new String[][] {
                {"老门东夜市", "地道小吃、烧烤", "距离600米  |  步行约8分钟", "🍢", "通宵"},
                {"唱吧KTV", "欢唱嗨皮", "距离450米  |  步行约6分钟", "🎤", "5折起"},
                {"金逸影城", "最新大片热映", "距离500米  |  步行约7分钟", "🎬", "29.9元"}
            };
        }

        // 添加推荐内容
        for (String[] rec : recommendations) {
            contentLayout.addView(createRecommendationCard(rec[0], rec[1], rec[2], rec[3], rec[4]));
        }
    }

    // 创建推荐卡片
    private RelativeLayout createRecommendationCard(String title, String description, String distance, String emoji, String discount) {
        RelativeLayout card = new RelativeLayout(this);
        LinearLayout.LayoutParams cardParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        cardParams.setMargins(0, 0, 0, (int) (10 * getResources().getDisplayMetrics().density));
        card.setLayoutParams(cardParams);
        card.setBackgroundColor(0xFFFFFFFF);
        card.setElevation(1 * getResources().getDisplayMetrics().density);
        int padding = (int) (14 * getResources().getDisplayMetrics().density);
        card.setPadding(padding, padding, padding, padding);

        // 缩略图 - 左侧emoji图标
        TextView thumbnail = new TextView(this);
        thumbnail.setId(View.generateViewId());
        thumbnail.setText(emoji);
        thumbnail.setTextSize(36);
        thumbnail.setGravity(Gravity.CENTER);
        thumbnail.setBackgroundColor(0xFFFFF9C4);
        RelativeLayout.LayoutParams thumbParams = new RelativeLayout.LayoutParams(
            (int) (64 * getResources().getDisplayMetrics().density),
            (int) (64 * getResources().getDisplayMetrics().density)
        );
        thumbParams.addRule(RelativeLayout.ALIGN_PARENT_START);
        thumbParams.addRule(RelativeLayout.CENTER_VERTICAL);
        thumbnail.setLayoutParams(thumbParams);

        // 文字布局 - 缩略图右侧
        LinearLayout textLayout = new LinearLayout(this);
        textLayout.setOrientation(LinearLayout.VERTICAL);
        RelativeLayout.LayoutParams textParams = new RelativeLayout.LayoutParams(
            RelativeLayout.LayoutParams.WRAP_CONTENT,
            RelativeLayout.LayoutParams.WRAP_CONTENT
        );
        textParams.addRule(RelativeLayout.END_OF, thumbnail.getId());
        textParams.addRule(RelativeLayout.CENTER_VERTICAL);
        textParams.setMarginStart((int) (12 * getResources().getDisplayMetrics().density));
        textParams.setMarginEnd((int) (70 * getResources().getDisplayMetrics().density));
        textLayout.setLayoutParams(textParams);

        // 标题行 - 包含标题和优惠标签
        LinearLayout titleRow = new LinearLayout(this);
        titleRow.setOrientation(LinearLayout.HORIZONTAL);
        titleRow.setGravity(Gravity.CENTER_VERTICAL);

        // 标题
        TextView titleView = new TextView(this);
        titleView.setText(title);
        titleView.setTextSize(15);
        titleView.setTextColor(0xFF000000);
        titleView.getPaint().setFakeBoldText(true);
        titleRow.addView(titleView);

        // 优惠标签
        TextView discountTag = new TextView(this);
        discountTag.setText(discount);
        discountTag.setTextSize(11);
        discountTag.setTextColor(0xFFFFFFFF);
        discountTag.setBackgroundColor(0xFFFF5722);
        discountTag.getPaint().setFakeBoldText(true);
        int tagPadding = (int) (6 * getResources().getDisplayMetrics().density);
        discountTag.setPadding(tagPadding, (int)(3 * getResources().getDisplayMetrics().density),
                              tagPadding, (int)(3 * getResources().getDisplayMetrics().density));
        LinearLayout.LayoutParams tagParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        tagParams.setMarginStart((int) (8 * getResources().getDisplayMetrics().density));
        discountTag.setLayoutParams(tagParams);
        titleRow.addView(discountTag);

        textLayout.addView(titleRow);

        // 描述
        TextView descView = new TextView(this);
        descView.setText(description);
        descView.setTextSize(12);
        descView.setTextColor(0xFF666666);
        LinearLayout.LayoutParams descParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        descParams.setMargins(0, (int) (4 * getResources().getDisplayMetrics().density), 0, 0);
        descView.setLayoutParams(descParams);
        textLayout.addView(descView);

        // 距离信息
        TextView distView = new TextView(this);
        distView.setText(distance);
        distView.setTextSize(11);
        distView.setTextColor(0xFF999999);
        LinearLayout.LayoutParams distParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        distParams.setMargins(0, (int) (4 * getResources().getDisplayMetrics().density), 0, 0);
        distView.setLayoutParams(distParams);
        textLayout.addView(distView);

        // 查看按钮
        TextView button = new TextView(this);
        button.setText("查看");
        button.setTextSize(13);
        button.setTextColor(0xFF000000);
        button.setGravity(Gravity.CENTER);
        button.setBackgroundResource(R.drawable.button_rounded);
        RelativeLayout.LayoutParams buttonParams = new RelativeLayout.LayoutParams(
            (int) (60 * getResources().getDisplayMetrics().density),
            (int) (32 * getResources().getDisplayMetrics().density)
        );
        buttonParams.addRule(RelativeLayout.ALIGN_PARENT_END);
        buttonParams.addRule(RelativeLayout.CENTER_VERTICAL);
        button.setLayoutParams(buttonParams);

        button.setOnClickListener(v ->
            showRecommendationDetail(title, description, distance, emoji, discount)
        );

        card.addView(thumbnail);
        card.addView(textLayout);
        card.addView(button);

        return card;
    }

    // 显示推荐详情对话框
    private void showRecommendationDetail(String title, String description, String distance, String emoji, String discount) {
        Dialog dialog = new Dialog(this, android.R.style.Theme_Translucent_NoTitleBar);
        dialog.setContentView(R.layout.dialog_recommendation_detail);

        // 设置底部弹出高度为屏幕的80%
        View bottomSheet = dialog.findViewById(R.id.bottomSheetDetail);
        int screenHeight = getResources().getDisplayMetrics().heightPixels;
        int targetHeight = (int) (screenHeight * 0.8);
        RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(
            RelativeLayout.LayoutParams.MATCH_PARENT,
            targetHeight
        );
        params.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
        bottomSheet.setLayoutParams(params);

        // 设置数据
        TextView detailImage = dialog.findViewById(R.id.detailImage);
        TextView detailTitle = dialog.findViewById(R.id.detailTitle);
        TextView detailDiscount = dialog.findViewById(R.id.detailDiscount);
        TextView detailRecommendReason = dialog.findViewById(R.id.detailRecommendReason);
        TextView detailPrice = dialog.findViewById(R.id.detailPrice);
        TextView detailAddress = dialog.findViewById(R.id.detailAddress);
        TextView detailDistance = dialog.findViewById(R.id.detailDistance);
        TextView detailRating = dialog.findViewById(R.id.detailRating);
        LinearLayout reviewsContainer = dialog.findViewById(R.id.reviewsContainer);

        detailImage.setText(emoji);
        detailTitle.setText(title);
        detailDiscount.setText(discount);
        detailRecommendReason.setText(description + "，深受顾客喜爱");

        // 根据商家设置价格
        String priceText = getPriceForMerchant(title);
        detailPrice.setText(priceText);

        // 设置地址
        String address = getAddressForMerchant(title);
        detailAddress.setText(address);
        detailDistance.setText(distance);

        // 设置评分
        detailRating.setText("4.8");

        // 添加用户评价
        String[][] reviews = getReviewsForMerchant(title);
        for (String[] review : reviews) {
            reviewsContainer.addView(createReviewCard(review));
        }

        // 关闭按钮
        TextView closeButton = dialog.findViewById(R.id.closeDetailDialog);
        closeButton.setOnClickListener(v -> dialog.dismiss());

        // 导航按钮
        TextView navigateButton = dialog.findViewById(R.id.detailNavigateButton);
        navigateButton.setOnClickListener(v -> {
            Toast.makeText(this, "导航至: " + title, Toast.LENGTH_SHORT).show();
            dialog.dismiss();
        });

        // 预订按钮
        TextView bookButton = dialog.findViewById(R.id.detailBookButton);
        bookButton.setOnClickListener(v -> {
            Toast.makeText(this, "预订: " + title, Toast.LENGTH_SHORT).show();
            dialog.dismiss();
        });

        // 背景点击关闭
        View dimBackground = dialog.findViewById(R.id.dimBackgroundDetail);
        dimBackground.setOnClickListener(v -> dialog.dismiss());

        // 底部弹出动画
        bottomSheet.setTranslationY(targetHeight);
        bottomSheet.animate()
            .translationY(0)
            .setDuration(300)
            .start();

        dialog.show();
    }

    // 获取商家价格
    private String getPriceForMerchant(String merchant) {
        if (merchant.contains("大排档")) return "¥58";
        if (merchant.contains("和府")) return "¥35";
        if (merchant.contains("汉堡王")) return "¥42";
        if (merchant.contains("星巴克")) return "¥38";
        if (merchant.contains("瑞幸")) return "¥25";
        if (merchant.contains("海底捞")) return "¥120";
        if (merchant.contains("外婆家")) return "¥68";
        if (merchant.contains("必胜客")) return "¥75";
        if (merchant.contains("喜茶")) return "¥28";
        if (merchant.contains("面包新语")) return "¥32";
        if (merchant.contains("COSTA")) return "¥42";
        if (merchant.contains("KTV")) return "¥88";
        if (merchant.contains("影城")) return "¥45";
        if (merchant.contains("书店")) return "¥0";
        if (merchant.contains("健身")) return "¥199";
        if (merchant.contains("晨练")) return "¥0";
        if (merchant.contains("夜市")) return "¥50";
        return "¥48";
    }

    // 获取商家地址
    private String getAddressForMerchant(String merchant) {
        if (merchant.contains("大排档")) return "南京市玄武区中山东路18号德基广场7楼";
        if (merchant.contains("和府")) return "南京市玄武区中山路55号新街口金鹰购物中心B1层";
        if (merchant.contains("汉堡王")) return "南京市玄武区中山东路1号环亚广场1楼";
        if (merchant.contains("星巴克")) return "南京市玄武区中山东路18号德基广场1楼";
        if (merchant.contains("瑞幸")) return "南京市玄武区珠江路88号新世界中心A座1楼";
        if (merchant.contains("海底捞")) return "南京市玄武区中山路1号南京国际广场5楼";
        if (merchant.contains("外婆家")) return "南京市玄武区中山东路300号长发中心4楼";
        if (merchant.contains("必胜客")) return "南京市玄武区中山东路18号德基广场6楼";
        if (merchant.contains("喜茶")) return "南京市玄武区中山路79号1楼";
        if (merchant.contains("面包新语")) return "南京市玄武区珠江路1号正洪大厦1楼";
        if (merchant.contains("COSTA")) return "南京市玄武区中山东路18号德基广场2楼";
        if (merchant.contains("KTV")) return "南京市玄武区中山南路1号新街口百货5楼";
        if (merchant.contains("影城")) return "南京市玄武区中山东路18号德基广场8楼";
        if (merchant.contains("书店")) return "南京市玄武区广州路173号先锋书店";
        if (merchant.contains("健身")) return "南京市玄武区中山路18号新街口中心2楼";
        if (merchant.contains("晨练")) return "南京市玄武区玄武巷1号玄武湖景区";
        if (merchant.contains("夜市")) return "南京市秦淮区剪子巷老门东历史街区";
        return "南京市玄武区中山东路";
    }

    // 获取商家评价
    private String[][] getReviewsForMerchant(String merchant) {
        if (merchant.contains("大排档")) {
            return new String[][] {
                {"张**", "环境很好，盐水鸭特别正宗，小笼包皮薄馅大，值得推荐！"},
                {"李**", "金陵菜做得很地道，服务态度也不错，会再来的。"}
            };
        }
        if (merchant.contains("和府")) {
            return new String[][] {
                {"王**", "牛肉面料很足，汤底浓郁，小菜也很好吃。"},
                {"刘**", "性价比很高，面条劲道，环境干净整洁。"}
            };
        }
        if (merchant.contains("汉堡王")) {
            return new String[][] {
                {"陈**", "汉堡份量足，薯条很香脆，套餐很划算。"},
                {"周**", "出餐速度快，味道不错，适合快餐。"}
            };
        }
        // 默认评价
        return new String[][] {
            {"用户A", "服务很好，环境不错，值得推荐！"},
            {"用户B", "性价比高，下次还会来。"}
        };
    }

    // 创建评价卡片
    private LinearLayout createReviewCard(String[] review) {
        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        LinearLayout.LayoutParams cardParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        cardParams.setMargins(0, 0, 0, (int) (12 * getResources().getDisplayMetrics().density));
        card.setLayoutParams(cardParams);
        card.setBackgroundColor(0xFFF5F5F5);
        int padding = (int) (12 * getResources().getDisplayMetrics().density);
        card.setPadding(padding, padding, padding, padding);

        // 用户名和评分
        LinearLayout headerRow = new LinearLayout(this);
        headerRow.setOrientation(LinearLayout.HORIZONTAL);
        headerRow.setGravity(Gravity.CENTER_VERTICAL);

        TextView userName = new TextView(this);
        userName.setText(review[0]);
        userName.setTextSize(13);
        userName.setTextColor(0xFF000000);
        userName.getPaint().setFakeBoldText(true);
        headerRow.addView(userName);

        TextView stars = new TextView(this);
        stars.setText("  ⭐⭐⭐⭐⭐");
        stars.setTextSize(12);
        headerRow.addView(stars);

        card.addView(headerRow);

        // 评价内容
        TextView reviewText = new TextView(this);
        reviewText.setText(review[1]);
        reviewText.setTextSize(13);
        reviewText.setTextColor(0xFF666666);
        LinearLayout.LayoutParams textParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        textParams.setMargins(0, (int) (6 * getResources().getDisplayMetrics().density), 0, 0);
        reviewText.setLayoutParams(textParams);
        reviewText.setLineSpacing(2 * getResources().getDisplayMetrics().density, 1.0f);
        card.addView(reviewText);

        return card;
    }

    // 加载美食内容
    private void loadFoodContent() {
        LinearLayout contentLayout = nearbyRecommendContent;

        // 南京特色美食数据
        String[][] foods = {
            {"南京大排档", "正宗金陵菜", "盐水鸭、鸭血粉丝汤", "¥68/人", "⭐ 4.8", "300米", "新店优惠8折"},
            {"鸭得堡", "南京特色小吃", "烤鸭、鸭血粉丝", "¥35/人", "⭐ 4.7", "150米", "买一送一"},
            {"老门东小吃", "传统南京味道", "梅花糕、赤豆元宵", "¥20/人", "⭐ 4.9", "500米", "免费品尝"},
            {"绿柳居", "百年老字号", "素什锦、蟹黄包", "¥58/人", "⭐ 4.6", "420米", "会员9折"},
            {"韩复兴鸭子店", "盐水鸭专家", "桂花鸭、板鸭", "¥45/人", "⭐ 4.8", "280米", "满100减20"},
            {"安乐园", "民国风味餐厅", "美龄粥、松鼠鱼", "¥88/人", "⭐ 4.7", "350米", "套餐优惠"}
        };

        for (String[] food : foods) {
            contentLayout.addView(createFoodCard(food[0], food[1], food[2], food[3], food[4], food[5], food[6]));
        }
    }

    // 创建美食卡片
    private LinearLayout createFoodCard(String name, String type, String specialty, String price, String rating, String distance, String discount) {
        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        LinearLayout.LayoutParams cardParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        cardParams.setMargins(0, 0, 0, (int) (12 * getResources().getDisplayMetrics().density));
        card.setLayoutParams(cardParams);
        card.setBackgroundColor(0xFFFFFFFF);
        card.setElevation(1 * getResources().getDisplayMetrics().density);
        int padding = (int) (16 * getResources().getDisplayMetrics().density);
        card.setPadding(padding, padding, padding, padding);

        // 顶部行：名称和优惠标签
        RelativeLayout topRow = new RelativeLayout(this);
        topRow.setLayoutParams(new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        ));

        // 名称
        TextView nameView = new TextView(this);
        nameView.setId(View.generateViewId());
        nameView.setText(name);
        nameView.setTextSize(16);
        nameView.setTextColor(0xFF000000);
        nameView.getPaint().setFakeBoldText(true);
        RelativeLayout.LayoutParams nameParams = new RelativeLayout.LayoutParams(
            RelativeLayout.LayoutParams.WRAP_CONTENT,
            RelativeLayout.LayoutParams.WRAP_CONTENT
        );
        nameParams.addRule(RelativeLayout.ALIGN_PARENT_START);
        nameView.setLayoutParams(nameParams);
        topRow.addView(nameView);

        // 优惠标签
        TextView discountView = new TextView(this);
        discountView.setText(discount);
        discountView.setTextSize(12);
        discountView.setTextColor(0xFFFFFFFF);
        discountView.setBackgroundColor(0xFFFF5722);
        discountView.getPaint().setFakeBoldText(true);
        int tagPadding = (int) (6 * getResources().getDisplayMetrics().density);
        discountView.setPadding(tagPadding, (int)(3 * getResources().getDisplayMetrics().density),
                               tagPadding, (int)(3 * getResources().getDisplayMetrics().density));
        RelativeLayout.LayoutParams discountParams = new RelativeLayout.LayoutParams(
            RelativeLayout.LayoutParams.WRAP_CONTENT,
            RelativeLayout.LayoutParams.WRAP_CONTENT
        );
        discountParams.addRule(RelativeLayout.ALIGN_PARENT_END);
        discountParams.addRule(RelativeLayout.CENTER_VERTICAL);
        discountView.setLayoutParams(discountParams);
        topRow.addView(discountView);

        card.addView(topRow);

        // 类型和特色菜
        TextView typeView = new TextView(this);
        typeView.setText(type + " · " + specialty);
        typeView.setTextSize(13);
        typeView.setTextColor(0xFF666666);
        LinearLayout.LayoutParams typeParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        typeParams.setMargins(0, (int) (6 * getResources().getDisplayMetrics().density), 0, 0);
        typeView.setLayoutParams(typeParams);
        card.addView(typeView);

        // 底部信息行
        TextView infoView = new TextView(this);
        infoView.setText(price + "  •  " + distance + "  •  " + rating);
        infoView.setTextSize(13);
        infoView.setTextColor(0xFF999999);
        LinearLayout.LayoutParams infoParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        infoParams.setMargins(0, (int) (4 * getResources().getDisplayMetrics().density), 0, 0);
        infoView.setLayoutParams(infoParams);
        card.addView(infoView);

        card.setOnClickListener(v ->
            Toast.makeText(this, "查看: " + name, Toast.LENGTH_SHORT).show()
        );

        return card;
    }

    // 加载玩乐内容
    private void loadFunContent() {
        LinearLayout contentLayout = nearbyRecommendContent;

        // 南京玩乐数据
        String[][] funPlaces = {
            {"🎬", "金逸影城", "IMAX巨幕厅", "最新大片热映", "29.9元起", "德基广场8楼"},
            {"🎤", "唱吧麦颂KTV", "豪华包厢", "欢唱5小时套餐", "128元", "新街口百货5楼"},
            {"🎮", "大玩家超乐场", "VR体验+抓娃娃", "亲子娱乐好去处", "68元通票", "中央商场3楼"},
            {"🎭", "德云社南京分社", "相声演出", "每周五六日演出", "180元起", "老门东历史街区"},
            {"🏊", "全季游泳健身", "恒温泳池", "专业教练指导", "158元月卡", "珠江路88号"},
            {"🎯", "真人CS基地", "团建首选", "10人成团优惠", "88元/人", "紫金山脚下"}
        };

        for (String[] place : funPlaces) {
            contentLayout.addView(createFunCard(place[0], place[1], place[2], place[3], place[4], place[5]));
        }
    }

    // 创建玩乐卡片
    private RelativeLayout createFunCard(String icon, String name, String feature, String desc, String price, String location) {
        RelativeLayout card = new RelativeLayout(this);
        LinearLayout.LayoutParams cardParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        cardParams.setMargins(0, 0, 0, (int) (12 * getResources().getDisplayMetrics().density));
        card.setLayoutParams(cardParams);
        card.setBackgroundColor(0xFFFFFFFF);
        card.setElevation(1 * getResources().getDisplayMetrics().density);
        int padding = (int) (16 * getResources().getDisplayMetrics().density);
        card.setPadding(padding, padding, padding, padding);

        // 左侧图标
        TextView iconView = new TextView(this);
        iconView.setId(View.generateViewId());
        iconView.setText(icon);
        iconView.setTextSize(42);
        iconView.setGravity(Gravity.CENTER);
        iconView.setBackgroundColor(0xFFFFF9C4);
        RelativeLayout.LayoutParams iconParams = new RelativeLayout.LayoutParams(
            (int) (68 * getResources().getDisplayMetrics().density),
            (int) (68 * getResources().getDisplayMetrics().density)
        );
        iconParams.addRule(RelativeLayout.ALIGN_PARENT_START);
        iconParams.addRule(RelativeLayout.CENTER_VERTICAL);
        iconView.setLayoutParams(iconParams);
        card.addView(iconView);

        // 右侧内容
        LinearLayout contentLayout = new LinearLayout(this);
        contentLayout.setOrientation(LinearLayout.VERTICAL);
        RelativeLayout.LayoutParams contentParams = new RelativeLayout.LayoutParams(
            RelativeLayout.LayoutParams.MATCH_PARENT,
            RelativeLayout.LayoutParams.WRAP_CONTENT
        );
        contentParams.addRule(RelativeLayout.END_OF, iconView.getId());
        contentParams.setMarginStart((int) (12 * getResources().getDisplayMetrics().density));
        contentLayout.setLayoutParams(contentParams);

        // 名称
        TextView nameView = new TextView(this);
        nameView.setText(name);
        nameView.setTextSize(16);
        nameView.setTextColor(0xFF000000);
        nameView.getPaint().setFakeBoldText(true);
        contentLayout.addView(nameView);

        // 特色
        TextView featureView = new TextView(this);
        featureView.setText(feature + " · " + desc);
        featureView.setTextSize(13);
        featureView.setTextColor(0xFF666666);
        LinearLayout.LayoutParams featureParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        featureParams.setMargins(0, (int) (4 * getResources().getDisplayMetrics().density), 0, 0);
        featureView.setLayoutParams(featureParams);
        contentLayout.addView(featureView);

        // 价格和地址
        LinearLayout bottomRow = new LinearLayout(this);
        bottomRow.setOrientation(LinearLayout.HORIZONTAL);
        bottomRow.setGravity(Gravity.CENTER_VERTICAL);
        LinearLayout.LayoutParams bottomParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        bottomParams.setMargins(0, (int) (6 * getResources().getDisplayMetrics().density), 0, 0);
        bottomRow.setLayoutParams(bottomParams);

        TextView priceView = new TextView(this);
        priceView.setText(price);
        priceView.setTextSize(15);
        priceView.setTextColor(0xFFFF5722);
        priceView.getPaint().setFakeBoldText(true);
        bottomRow.addView(priceView);

        TextView locationView = new TextView(this);
        locationView.setText("  •  📍 " + location);
        locationView.setTextSize(12);
        locationView.setTextColor(0xFF999999);
        bottomRow.addView(locationView);

        contentLayout.addView(bottomRow);
        card.addView(contentLayout);

        card.setOnClickListener(v ->
            Toast.makeText(this, "查看: " + name, Toast.LENGTH_SHORT).show()
        );

        return card;
    }

    // 加载景点内容
    private void loadScenicContent() {
        LinearLayout contentLayout = nearbyRecommendContent;

        // 南京景点数据
        String[][] scenics = {
            {"🏛️", "中山陵", "国家5A级景区", "免费", "4.8", "近代建筑遗产群", "紫金山风景区"},
            {"🏯", "明孝陵", "世界文化遗产", "70元", "4.7", "明朝开国皇帝陵墓", "紫金山南麓"},
            {"🌊", "玄武湖", "金陵明珠", "免费", "4.6", "江南三大名湖之一", "玄武区玄武巷1号"},
            {"🏰", "南京城墙", "世界最长古城墙", "50元", "4.7", "明代军事防御工程", "中华门段"},
            {"🏛️", "总统府", "近代史博物馆", "40元", "4.8", "民国历史建筑群", "长江路292号"},
            {"🌸", "鸡鸣寺", "南朝第一寺", "10元", "4.5", "樱花盛开美景", "鸡鸣山东麓"},
            {"🏞️", "夫子庙", "秦淮风光带", "免费", "4.6", "江南贡院+乌衣巷", "秦淮河畔"},
            {"📚", "先锋书店", "最美书店", "免费", "4.9", "文艺打卡圣地", "五台山体育馆地下"}
        };

        for (String[] scenic : scenics) {
            contentLayout.addView(createScenicCard(scenic[0], scenic[1], scenic[2], scenic[3], scenic[4], scenic[5], scenic[6]));
        }
    }

    // 创建景点卡片
    private LinearLayout createScenicCard(String icon, String name, String category, String price, String rating, String feature, String address) {
        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams cardParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        cardParams.setMargins(0, 0, 0, (int) (12 * getResources().getDisplayMetrics().density));
        card.setLayoutParams(cardParams);
        card.setBackgroundColor(0xFFFFFFFF);
        card.setElevation(1 * getResources().getDisplayMetrics().density);
        int padding = (int) (16 * getResources().getDisplayMetrics().density);
        card.setPadding(padding, padding, padding, padding);

        // 左侧图标
        TextView iconView = new TextView(this);
        iconView.setText(icon);
        iconView.setTextSize(40);
        iconView.setGravity(Gravity.CENTER);
        iconView.setBackgroundColor(0xFFFFF9C4);
        LinearLayout.LayoutParams iconParams = new LinearLayout.LayoutParams(
            (int) (64 * getResources().getDisplayMetrics().density),
            (int) (64 * getResources().getDisplayMetrics().density)
        );
        iconParams.setMarginEnd((int) (14 * getResources().getDisplayMetrics().density));
        iconView.setLayoutParams(iconParams);
        card.addView(iconView);

        // 右侧内容
        LinearLayout contentLayout = new LinearLayout(this);
        contentLayout.setOrientation(LinearLayout.VERTICAL);
        LinearLayout.LayoutParams contentParams = new LinearLayout.LayoutParams(
            0,
            LinearLayout.LayoutParams.WRAP_CONTENT,
            1f
        );
        contentLayout.setLayoutParams(contentParams);

        // 名称和星级
        LinearLayout titleRow = new LinearLayout(this);
        titleRow.setOrientation(LinearLayout.HORIZONTAL);
        titleRow.setGravity(Gravity.CENTER_VERTICAL);

        TextView nameView = new TextView(this);
        nameView.setText(name);
        nameView.setTextSize(16);
        nameView.setTextColor(0xFF000000);
        nameView.getPaint().setFakeBoldText(true);
        titleRow.addView(nameView);

        TextView ratingView = new TextView(this);
        ratingView.setText("  ⭐ " + rating);
        ratingView.setTextSize(13);
        ratingView.setTextColor(0xFFFF9800);
        titleRow.addView(ratingView);

        contentLayout.addView(titleRow);

        // 类别和特色
        TextView categoryView = new TextView(this);
        categoryView.setText(category + " · " + feature);
        categoryView.setTextSize(12);
        categoryView.setTextColor(0xFF666666);
        LinearLayout.LayoutParams categoryParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        categoryParams.setMargins(0, (int) (4 * getResources().getDisplayMetrics().density), 0, 0);
        categoryView.setLayoutParams(categoryParams);
        contentLayout.addView(categoryView);

        // 地址
        TextView addressView = new TextView(this);
        addressView.setText("📍 " + address);
        addressView.setTextSize(11);
        addressView.setTextColor(0xFF999999);
        LinearLayout.LayoutParams addressParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        addressParams.setMargins(0, (int) (3 * getResources().getDisplayMetrics().density), 0, 0);
        addressView.setLayoutParams(addressParams);
        contentLayout.addView(addressView);

        card.addView(contentLayout);

        // 价格标签
        TextView priceView = new TextView(this);
        priceView.setText(price);
        priceView.setTextSize(15);
        priceView.setTextColor(price.equals("免费") ? 0xFF4CAF50 : 0xFFFF5722);
        priceView.getPaint().setFakeBoldText(true);
        priceView.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams priceParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        priceParams.gravity = Gravity.CENTER_VERTICAL;
        priceView.setLayoutParams(priceParams);
        card.addView(priceView);

        card.setOnClickListener(v ->
            Toast.makeText(this, "查看: " + name, Toast.LENGTH_SHORT).show()
        );

        return card;
    }

    // 加载附近的人内容
    private void loadNearbyPeopleContent() {
        LinearLayout contentLayout = nearbyRecommendContent;

        // 模拟附近的人数据：头像emoji、昵称、所在公交、距离(米)、个性签名
        String[][] nearbyUsers = {
            {"👨‍💼", "阳光下的微笑", "5路公交", "0", "今天天气不错，心情美美哒~"},
            {"👩‍🎓", "晨曦", "5路公交", "0", "去图书馆，有人一起吗？"},
            {"👨‍🎤", "时光旅人", "5路公交", "0", "耳机里的歌单分享给你💫"},
            {"👩‍💻", "星空物语", "5路公交", "0", "想找个咖啡馆写代码"},
            {"👨‍⚕️", "云淡风轻", "5路公交", "0", "刚下夜班，终于可以休息了"},
            {"👩‍🏫", "静待花开", "地铁2号线", "95", "最近在看《百年孤独》，有书友吗"},
            {"👨‍🔬", "追梦人", "2路公交", "120", "南京的秋天真美🍂"},
            {"👩‍🚀", "梦想起航", "11路公交", "150", "第一次来南京，求推荐美食！"},
            {"👩‍🔧", "向阳而生", "地铁3号线", "180", "周末爬紫金山约不约"},
            {"👨‍🎨", "行者无疆", "33路公交", "200", "用镜头记录这座城市的美"}
        };

        // 按距离排序（已经按距离从小到大排列）
        for (String[] user : nearbyUsers) {
            contentLayout.addView(createNearbyUserCard(user[0], user[1], user[2], user[3], user[4]));
        }
    }

    // 创建附近的人卡片
    private RelativeLayout createNearbyUserCard(String avatar, String nickname, String location, String distanceMeters, String signature) {
        RelativeLayout card = new RelativeLayout(this);
        LinearLayout.LayoutParams cardParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        cardParams.setMargins(0, 0, 0, (int) (10 * getResources().getDisplayMetrics().density));
        card.setLayoutParams(cardParams);
        card.setBackgroundColor(0xFFFFFFFF);
        card.setElevation(1 * getResources().getDisplayMetrics().density);
        int padding = (int) (12 * getResources().getDisplayMetrics().density);
        card.setPadding(padding, padding, padding, padding);

        // 头像 - 左侧
        TextView avatarView = new TextView(this);
        avatarView.setId(View.generateViewId());
        avatarView.setText(avatar);
        avatarView.setTextSize(32);
        avatarView.setGravity(Gravity.CENTER);
        avatarView.setBackgroundColor(0xFFFFF9C4);
        RelativeLayout.LayoutParams avatarParams = new RelativeLayout.LayoutParams(
            (int) (56 * getResources().getDisplayMetrics().density),
            (int) (56 * getResources().getDisplayMetrics().density)
        );
        avatarParams.addRule(RelativeLayout.ALIGN_PARENT_START);
        avatarParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
        avatarView.setLayoutParams(avatarParams);

        // 用户信息布局 - 头像右侧，聊天按钮左侧
        LinearLayout infoLayout = new LinearLayout(this);
        infoLayout.setId(View.generateViewId());
        infoLayout.setOrientation(LinearLayout.VERTICAL);
        RelativeLayout.LayoutParams infoParams = new RelativeLayout.LayoutParams(
            RelativeLayout.LayoutParams.MATCH_PARENT,
            RelativeLayout.LayoutParams.WRAP_CONTENT
        );
        infoParams.addRule(RelativeLayout.END_OF, avatarView.getId());
        infoParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
        infoParams.setMarginStart((int) (12 * getResources().getDisplayMetrics().density));
        infoParams.setMarginEnd((int) (80 * getResources().getDisplayMetrics().density));
        infoLayout.setLayoutParams(infoParams);

        // 第一行：昵称 + 同车人标签
        LinearLayout nameRow = new LinearLayout(this);
        nameRow.setOrientation(LinearLayout.HORIZONTAL);
        nameRow.setGravity(Gravity.CENTER_VERTICAL);

        TextView nicknameView = new TextView(this);
        nicknameView.setText(nickname);
        nicknameView.setTextSize(15);
        nicknameView.setTextColor(0xFF000000);
        nicknameView.getPaint().setFakeBoldText(true);
        nicknameView.setSingleLine(true);
        nicknameView.setEllipsize(android.text.TextUtils.TruncateAt.END);
        nameRow.addView(nicknameView);

        // 同车人标签（仅5路公交显示）
        if (location.equals("5路公交")) {
            TextView sameCarTag = new TextView(this);
            sameCarTag.setText("同车人");
            sameCarTag.setTextSize(10);
            sameCarTag.setTextColor(0xFFFFFFFF);
            sameCarTag.setBackgroundColor(0xFFFFD700);
            sameCarTag.getPaint().setFakeBoldText(true);
            int tagPadding = (int) (4 * getResources().getDisplayMetrics().density);
            sameCarTag.setPadding(tagPadding, (int)(2 * getResources().getDisplayMetrics().density),
                                 tagPadding, (int)(2 * getResources().getDisplayMetrics().density));
            LinearLayout.LayoutParams tagParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            );
            tagParams.setMarginStart((int) (6 * getResources().getDisplayMetrics().density));
            sameCarTag.setLayoutParams(tagParams);
            nameRow.addView(sameCarTag);
        }

        infoLayout.addView(nameRow);

        // 第二行：个性签名
        TextView signatureView = new TextView(this);
        signatureView.setText(signature);
        signatureView.setTextSize(12);
        signatureView.setTextColor(0xFF666666);
        signatureView.setMaxLines(1);
        signatureView.setEllipsize(android.text.TextUtils.TruncateAt.END);
        LinearLayout.LayoutParams sigParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        sigParams.setMargins(0, (int) (4 * getResources().getDisplayMetrics().density), 0, 0);
        signatureView.setLayoutParams(sigParams);
        infoLayout.addView(signatureView);

        // 第三行：位置 + 距离
        LinearLayout locationRow = new LinearLayout(this);
        locationRow.setOrientation(LinearLayout.HORIZONTAL);
        locationRow.setGravity(Gravity.CENTER_VERTICAL);
        LinearLayout.LayoutParams locationRowParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        locationRowParams.setMargins(0, (int) (4 * getResources().getDisplayMetrics().density), 0, 0);
        locationRow.setLayoutParams(locationRowParams);

        TextView locationIcon = new TextView(this);
        locationIcon.setText("🚌");
        locationIcon.setTextSize(11);
        locationRow.addView(locationIcon);

        TextView locationText = new TextView(this);
        locationText.setText(" " + location);
        locationText.setTextSize(11);
        locationText.setTextColor(0xFF999999);
        locationRow.addView(locationText);

        TextView distanceDot = new TextView(this);
        distanceDot.setText("  •  ");
        distanceDot.setTextSize(11);
        distanceDot.setTextColor(0xFF999999);
        locationRow.addView(distanceDot);

        TextView distanceView = new TextView(this);
        distanceView.setText(distanceMeters + "米");
        distanceView.setTextSize(11);
        distanceView.setTextColor(0xFFFF5722);
        locationRow.addView(distanceView);

        infoLayout.addView(locationRow);

        // 聊天按钮 - 右侧
        TextView chatButton = new TextView(this);
        chatButton.setText("💬");
        chatButton.setTextSize(24);
        chatButton.setGravity(Gravity.CENTER);
        chatButton.setBackgroundColor(0xFFFFF9C4);
        chatButton.setClickable(true);
        chatButton.setFocusable(true);
        RelativeLayout.LayoutParams chatParams = new RelativeLayout.LayoutParams(
            (int) (50 * getResources().getDisplayMetrics().density),
            (int) (50 * getResources().getDisplayMetrics().density)
        );
        chatParams.addRule(RelativeLayout.ALIGN_PARENT_END);
        chatParams.addRule(RelativeLayout.CENTER_VERTICAL);
        chatButton.setLayoutParams(chatParams);

        chatButton.setOnClickListener(v ->
            Toast.makeText(this, "开始与 " + nickname + " 聊天", Toast.LENGTH_SHORT).show()
        );

        card.addView(avatarView);
        card.addView(infoLayout);
        card.addView(chatButton);

        card.setOnClickListener(v ->
            Toast.makeText(this, "查看 " + nickname + " 的主页", Toast.LENGTH_SHORT).show()
        );

        return card;
    }

    // 显示WiFi连接弹窗
    private void showWifiDialog() {
        Dialog dialog = new Dialog(this);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.dialog_wifi_connect);
        dialog.setCancelable(true);

        // 设置对话框宽度
        Window window = dialog.getWindow();
        if (window != null) {
            window.setLayout(
                (int) (getResources().getDisplayMetrics().widthPixels * 0.85),
                LinearLayout.LayoutParams.WRAP_CONTENT
            );
            window.setBackgroundDrawableResource(android.R.color.transparent);
        }

        // 取消按钮
        TextView btnCancel = dialog.findViewById(R.id.btnWifiCancel);
        btnCancel.setOnClickListener(v -> {
            Toast.makeText(this, "已取消连接", Toast.LENGTH_SHORT).show();
            dialog.dismiss();
        });

        // 连接按钮
        TextView btnConnect = dialog.findViewById(R.id.btnWifiConnect);
        btnConnect.setOnClickListener(v -> {
            Toast.makeText(this, "正在连接 5路公交...", Toast.LENGTH_SHORT).show();
            dialog.dismiss();
            // 延迟显示连接成功提示
            new Handler().postDelayed(() -> {
                isConnected = true;
                wifiButton.setBackgroundResource(R.drawable.button_rounded);
                Toast.makeText(this, "WiFi连接成功！", Toast.LENGTH_SHORT).show();
            }, 1500);
        });

        dialog.show();
    }
}
