package com.example.helloworldapp;

import android.app.Activity;
import android.app.Dialog;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.provider.MediaStore;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;
import android.util.Log;
import java.io.InputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONObject;
import org.json.JSONArray;

public class MainActivity extends Activity {
    private LinearLayout navHome;
    private LinearLayout navDiscover;
    private LinearLayout navWifi;
    private LinearLayout navFavorite;
    private LinearLayout navProfile;
    private Button wifiButton;
    private TextView transferDetailButton;
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
    private LinearLayout nearbyRecommendContent;
    private Toast customToast;
    private boolean isConnected = false;

    // 发现页面相关
    private RelativeLayout discoverPage;
    private LinearLayout discoverPostList;
    private TextView btnPublish;
    private ScrollView mainScrollView;
    private androidx.swiperefreshlayout.widget.SwipeRefreshLayout swipeRefreshLayout;
    private TextView tabLookAround;
    private TextView tabNearbyPeople;
    private ScrollView nearbyPeopleContainer;
    private LinearLayout nearbyPeopleList;

    // 我的页面相关
    private LinearLayout profilePage;
    private TextView profileAvatar;
    private TextView profileNickname;
    private TextView profileUserId;
    private TextView profilePostCount;
    private TextView profileLikeCount;
    private TextView profileCollectCount;
    private LinearLayout btnEditProfile;
    private LinearLayout btnMyPosts;
    private LinearLayout btnMyCollects;

    // 我的发布页面相关
    private RelativeLayout myPostsPage;
    private LinearLayout myPostsList;
    private LinearLayout myPostsEmptyState;
    private androidx.swiperefreshlayout.widget.SwipeRefreshLayout myPostsSwipeRefresh;
    private ImageView btnBackFromMyPosts;

    // AI 助手页面相关
    private RelativeLayout aiChatPage;
    private LinearLayout aiChatMessageList;
    private LinearLayout aiChatWelcome;
    private LinearLayout aiChatLoadingIndicator;
    private ScrollView aiChatScrollView;
    private android.widget.EditText aiChatInput;
    private Button aiChatSendButton;
    private ImageView btnBackFromAiChat;
    private java.util.ArrayList<ChatMessage> chatHistory = new java.util.ArrayList<>();

    // 首页AI聊天（金陵喵）相关
    private ScrollView homeAiChatHistory;
    private LinearLayout homeAiMessageList;
    private android.widget.EditText homeAiInput;
    private Button homeAiSendButton;
    private java.util.ArrayList<ChatMessage> homeAiChatMessages = new java.util.ArrayList<>();

    // 优惠页面相关
    private LinearLayout offersPage;

    // WiFi 页面相关
    private RelativeLayout wifiPage;
    private TextView wifiStatusTitle;
    private TextView wifiCountText;
    private Button btnQuickConnect;
    private TextView btnRefreshWifi;
    private LinearLayout wifiListContainer;
    private LinearLayout merchantListContainer;
    private java.util.List<WiFiItem> wifiList = new java.util.ArrayList<>();
    private java.util.List<MerchantItem> merchantList = new java.util.ArrayList<>();

    // WiFi连接历史（模拟用户连接过的车次）
    private java.util.ArrayList<String> connectedBusHistory = new java.util.ArrayList<>();

    // 图片选择请求码
    private static final int PICK_IMAGE_REQUEST = 1001;

    // 当前发布对话框的引用
    private Dialog currentPublishDialog;
    private LinearLayout currentImagePreviewContainer;
    private java.util.ArrayList<Uri> selectedImages = new java.util.ArrayList<>();
    private android.widget.EditText currentEtTitle;
    private android.widget.EditText currentEtContent;
    private java.util.ArrayList<String> currentSelectedBusList;

    // API 客户端
    private ApiClient apiClient;

    // 用户管理器
    private UserManager userManager;

    // 功能管理器 - 将大型功能模块拆分到独立的管理器类中
    private WiFiTabManager wifiTabManager;
    private DiscoverTabManager discoverTabManager;
    private ProfileTabManager profileTabManager;
    private HomeTabManager homeTabManager;
    private AIChatManager aiChatManager;
    private DialogManager dialogManager;

    // 语言设置按钮
    private LinearLayout btnLanguageSettings;

    @Override
    protected void attachBaseContext(android.content.Context newBase) {
        // 应用保存的语言设置
        String languageCode = LanguageHelper.getSavedLanguage(newBase);
        android.content.Context context = LanguageHelper.applyLanguage(newBase, languageCode);
        super.attachBaseContext(context);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 初始化 API 客户端
        apiClient = new ApiClient();

        // 初始化用户管理器
        userManager = new UserManager(this);

        // 检查是否首次启动
        if (userManager.isFirstLaunch()) {
            // 首次启动，初始化新用户
            userManager.initializeNewUser();
            userManager.setFirstLaunchCompleted();
        }

        // 初始化WiFi连接历史（模拟用户之前连接过的车次）
        connectedBusHistory.add("5路");
        connectedBusHistory.add("11路");
        connectedBusHistory.add("2路");

        // 显示WiFi连接弹窗
        // showWifiDialog();  // 已禁用开机自动弹出WiFi连接对话框

        // 初始化控件
        navHome = findViewById(R.id.navHome);
        navDiscover = findViewById(R.id.navDiscover);
        navWifi = findViewById(R.id.navWifi);
        navFavorite = findViewById(R.id.navFavorite);
        navProfile = findViewById(R.id.navProfile);
        wifiButton = findViewById(R.id.wifiButton);
        transferDetailButton = findViewById(R.id.transferDetailButton);
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
        nearbyRecommendContent = findViewById(R.id.nearbyRecommendContent);

        // 初始化发现页面控件
        mainScrollView = findViewById(R.id.mainScrollView);
        discoverPage = findViewById(R.id.discoverPage);
        discoverPostList = findViewById(R.id.discoverPostList);
        btnPublish = findViewById(R.id.btnPublish);
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout);
        tabLookAround = findViewById(R.id.tabLookAround);
        tabNearbyPeople = findViewById(R.id.tabNearbyPeople);
        nearbyPeopleContainer = findViewById(R.id.nearbyPeopleContainer);
        nearbyPeopleList = findViewById(R.id.nearbyPeopleList);

        // 设置下拉刷新监听器
        swipeRefreshLayout.setOnRefreshListener(() -> {
            loadDiscoverPosts();
        });

        // 设置刷新动画颜色
        swipeRefreshLayout.setColorSchemeColors(0xFF2196F3, 0xFF4CAF50, 0xFFFF5722);

        // 设置"逛逛"tab的初始下划线效果
        tabLookAround.getPaint().setUnderlineText(true);

        // 设置发现页面Tab切换
        tabLookAround.setOnClickListener(v -> {
            // 切换到逛逛
            tabLookAround.setTextColor(0xFF000000);
            tabLookAround.getPaint().setFakeBoldText(true);
            tabLookAround.getPaint().setUnderlineText(true);
            tabLookAround.invalidate();

            tabNearbyPeople.setTextColor(0xFF999999);
            tabNearbyPeople.getPaint().setFakeBoldText(false);
            tabNearbyPeople.getPaint().setUnderlineText(false);
            tabNearbyPeople.invalidate();

            swipeRefreshLayout.setVisibility(View.VISIBLE);
            nearbyPeopleContainer.setVisibility(View.GONE);
        });

        tabNearbyPeople.setOnClickListener(v -> {
            // 切换到附近的人
            tabNearbyPeople.setTextColor(0xFF000000);
            tabNearbyPeople.getPaint().setFakeBoldText(true);
            tabNearbyPeople.getPaint().setUnderlineText(true);
            tabNearbyPeople.invalidate();

            tabLookAround.setTextColor(0xFF999999);
            tabLookAround.getPaint().setFakeBoldText(false);
            tabLookAround.getPaint().setUnderlineText(false);
            tabLookAround.invalidate();

            swipeRefreshLayout.setVisibility(View.GONE);
            nearbyPeopleContainer.setVisibility(View.VISIBLE);

            // 加载附近的人内容
            loadNearbyPeopleToDiscover();
        });

        // 初始化我的页面控件
        profilePage = findViewById(R.id.profilePage);
        profileAvatar = findViewById(R.id.profileAvatar);
        profileNickname = findViewById(R.id.profileNickname);
        profileUserId = findViewById(R.id.profileUserId);
        profilePostCount = findViewById(R.id.profilePostCount);
        profileLikeCount = findViewById(R.id.profileLikeCount);
        profileCollectCount = findViewById(R.id.profileCollectCount);
        btnEditProfile = findViewById(R.id.btnEditProfile);
        btnMyPosts = findViewById(R.id.btnMyPosts);
        btnMyCollects = findViewById(R.id.btnMyCollects);

        // 我的发布页面
        myPostsPage = findViewById(R.id.myPostsPage);
        myPostsList = findViewById(R.id.myPostsList);
        myPostsEmptyState = findViewById(R.id.myPostsEmptyState);
        myPostsSwipeRefresh = findViewById(R.id.myPostsSwipeRefresh);
        btnBackFromMyPosts = findViewById(R.id.btnBackFromMyPosts);

        // AI 助手页面
        aiChatPage = findViewById(R.id.aiChatPage);
        aiChatMessageList = findViewById(R.id.aiChatMessageList);
        aiChatWelcome = findViewById(R.id.aiChatWelcome);
        aiChatLoadingIndicator = findViewById(R.id.aiChatLoadingIndicator);
        aiChatScrollView = findViewById(R.id.aiChatScrollView);
        aiChatInput = findViewById(R.id.aiChatInput);
        aiChatSendButton = findViewById(R.id.aiChatSendButton);
        btnBackFromAiChat = findViewById(R.id.btnBackFromAiChat);

        // 首页AI聊天（金陵喵）
        homeAiChatHistory = findViewById(R.id.homeAiChatHistory);
        homeAiMessageList = findViewById(R.id.homeAiMessageList);
        homeAiInput = findViewById(R.id.homeAiInput);
        homeAiSendButton = findViewById(R.id.homeAiSendButton);

        // 优惠页面
        offersPage = findViewById(R.id.offersPage);

        // 初始化功能管理器
        homeTabManager = new HomeTabManager(this);
        homeTabManager.initialize();

        aiChatManager = new AIChatManager(this);
        aiChatManager.initialize();

        dialogManager = new DialogManager(this, userManager);

        wifiTabManager = new WiFiTabManager(this);
        wifiTabManager.initialize();

        discoverTabManager = new DiscoverTabManager(this, apiClient, userManager);
        discoverTabManager.initialize();

        profileTabManager = new ProfileTabManager(this, apiClient, userManager);
        profileTabManager.initialize();

        // WiFi按钮点击事件
        wifiButton.setOnClickListener(v -> {
            if (!isConnected) {
                // 显示连接中Toast
                dialogManager.showConnectingToast();

                // 2秒后关闭Toast并更新按钮
                new Handler().postDelayed(() -> {
                    dialogManager.cancelToast();
                    isConnected = true;
                    wifiButton.setText("已连接");
                    wifiButton.setBackgroundResource(R.drawable.button_rounded_green);
                    wifiButton.setTextColor(0xFFFFFFFF); // 白色文字
                    Toast.makeText(MainActivity.this, "WiFi连接成功", Toast.LENGTH_SHORT).show();
                }, 2000);
            } else {
                dialogManager.showWifiStatusDialog();
            }
        });

        // 底部导航点击事件
        navHome.setOnClickListener(v -> {
            // 显示主页面，隐藏其他页面
            homeTabManager.show();
            discoverTabManager.hide();
            profileTabManager.hide();
            offersPage.setVisibility(View.GONE);
            myPostsPage.setVisibility(View.GONE);
            aiChatManager.hideAIChatPage();
            wifiTabManager.hide();
        });

        navDiscover.setOnClickListener(v -> {
            // 检查是否设置了用户信息
            if (discoverTabManager.checkAndShowWelcomeIfNeeded(() -> {})) {
                dialogManager.showWelcomeDialog();
                return;
            }
            // 显示发现页面，隐藏其他页面
            homeTabManager.hide();
            discoverTabManager.show();
            profileTabManager.hide();
            offersPage.setVisibility(View.GONE);
            myPostsPage.setVisibility(View.GONE);
            aiChatManager.hideAIChatPage();
            wifiTabManager.hide();
        });

        navWifi.setOnClickListener(v -> {
            // 显示WiFi页面，隐藏其他页面
            homeTabManager.hide();
            discoverTabManager.hide();
            profileTabManager.hide();
            myPostsPage.setVisibility(View.GONE);
            aiChatManager.hideAIChatPage();
            offersPage.setVisibility(View.GONE);
            wifiTabManager.show();
        });

        navFavorite.setOnClickListener(v -> {
            // 显示优惠页面，隐藏其他页面
            homeTabManager.hide();
            discoverTabManager.hide();
            profileTabManager.hide();
            myPostsPage.setVisibility(View.GONE);
            aiChatManager.hideAIChatPage();
            offersPage.setVisibility(View.VISIBLE);
            wifiTabManager.hide();
        });

        navProfile.setOnClickListener(v -> {
            // 显示我的页面，隐藏其他页面
            homeTabManager.hide();
            discoverTabManager.hide();
            offersPage.setVisibility(View.GONE);
            myPostsPage.setVisibility(View.GONE);
            aiChatManager.hideAIChatPage();
            wifiTabManager.hide();
            profileTabManager.show();
        });

        // 换乘详细信息按钮点击事件
        transferDetailButton.setOnClickListener(v -> dialogManager.showTransferDetailDialog(false));

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

        // 我的页面点击事件
        btnEditProfile.setOnClickListener(v -> showProfileEditDialog());
        btnMyPosts.setOnClickListener(v -> showMyPostsPage());
        btnMyCollects.setOnClickListener(v -> Toast.makeText(this, "我的收藏", Toast.LENGTH_SHORT).show());

        // 语言设置按钮（如果布局中有的话）
        // 注意：需要在布局文件中添加 btnLanguageSettings 按钮
        // 暂时注释掉这部分代码，因为布局中没有该按钮
        /*
        try {
            btnLanguageSettings = findViewById(R.id.btnLanguageSettings);
            if (btnLanguageSettings != null) {
                btnLanguageSettings.setOnClickListener(v -> showLanguageSelectionDialog());
            }
        } catch (Exception e) {
            // 如果布局中没有语言设置按钮，可以忽略
            Log.d("MainActivity", "Language settings button not found in layout");
        }
        */

        // 临时方案：可以将我的收藏按钮用作语言设置（仅用于测试）
        // 取消下面这行的注释来将"我的收藏"按钮临时改为语言设置
        // btnMyCollects.setOnClickListener(v -> showLanguageSelectionDialog());

        // 我的发布页面事件
        btnBackFromMyPosts.setOnClickListener(v -> {
            myPostsPage.setVisibility(View.GONE);
            profilePage.setVisibility(View.VISIBLE);
        });

        myPostsSwipeRefresh.setOnRefreshListener(() -> loadMyPosts());
        myPostsSwipeRefresh.setColorSchemeColors(0xFF2196F3, 0xFF4CAF50, 0xFFFF5722);

        // AI 助手页面事件
        btnBackFromAiChat.setOnClickListener(v -> {
            aiChatPage.setVisibility(View.GONE);
            profilePage.setVisibility(View.VISIBLE);
        });

        aiChatSendButton.setOnClickListener(v -> sendAiMessage());

        // 首页AI聊天（金陵喵）事件
        homeAiSendButton.setOnClickListener(v -> sendHomeAiMessage());

        // 点击头像换头像
        profileAvatar.setOnClickListener(v -> {
            String newAvatar = userManager.generateRandomAvatar();
            profileAvatar.setText(newAvatar);
            userManager.saveUserInfo(userManager.getNickname(), newAvatar);
            userManager.syncToServer(new UserManager.SyncCallback() {
                @Override
                public void onSuccess() {
                    runOnUiThread(() -> Toast.makeText(MainActivity.this, "头像已更新", Toast.LENGTH_SHORT).show());
                }
                @Override
                public void onFailure(String error) {
                    runOnUiThread(() -> Toast.makeText(MainActivity.this, "同步失败: " + error, Toast.LENGTH_SHORT).show());
                }
            });
        });
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

    // 加载附近的人到发现页面
    private void loadNearbyPeopleToDiscover() {
        nearbyPeopleList.removeAllViews();

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
            nearbyPeopleList.addView(createNearbyUserCard(user[0], user[1], user[2], user[3], user[4]));
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
            dialog.dismiss();
        });

        // 连接按钮
        TextView btnConnect = dialog.findViewById(R.id.btnWifiConnect);
        btnConnect.setOnClickListener(v -> {
            dialog.dismiss();
            showWifiConnectingToast();
        });

        dialog.show();
    }

    // 显示WiFi连接中Toast
    private void showWifiConnectingToast() {
        // 创建自定义Toast
        LayoutInflater inflater = getLayoutInflater();
        View layout = inflater.inflate(R.layout.custom_toast, null);

        TextView toastText = layout.findViewById(R.id.toastText);
        toastText.setText("连接中");

        Toast toast = new Toast(getApplicationContext());
        toast.setGravity(Gravity.CENTER, 0, 0);
        toast.setDuration(Toast.LENGTH_SHORT);
        toast.setView(layout);
        toast.show();

        // 1秒后更新WiFi连接状态
        new Handler().postDelayed(() -> {
            isConnected = true;
            wifiButton.setText("已连接");
            wifiButton.setBackgroundResource(R.drawable.button_rounded_green);
            wifiButton.setTextColor(0xFFFFFFFF);
        }, 1000);
    }

    // 加载发现页面的帖子列表
    private void loadDiscoverPosts() {
        // 添加发布按钮点击事件（只需要设置一次）
        btnPublish.setOnClickListener(v -> showPublishDialog());

        // 从后端加载真实数据
        loadPostsFromBackend();
    }

    // 创建帖子卡片
    private View createPostCard(String postId, String avatar, String username, String time, String title, String content, String busTag, String likes, String comments, String imageEmoji, boolean isLikedByUser) {
        View card = LayoutInflater.from(this).inflate(R.layout.item_community_post, null);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        card.setLayoutParams(params);

        // 设置数据
        TextView avatarView = card.findViewById(R.id.postAvatar);
        TextView usernameView = card.findViewById(R.id.postUsername);
        TextView timeView = card.findViewById(R.id.postTime);
        TextView titleView = card.findViewById(R.id.postTitle);
        TextView contentView = card.findViewById(R.id.postContent);
        TextView busTagView = card.findViewById(R.id.postBusTag);
        TextView likeBtn = card.findViewById(R.id.postLikeBtn);
        TextView commentBtn = card.findViewById(R.id.postCommentBtn);
        LinearLayout imageContainer = card.findViewById(R.id.postImageContainer);
        android.widget.ImageView imageView1 = card.findViewById(R.id.postImage1);
        android.widget.ImageView imageView2 = card.findViewById(R.id.postImage2);
        android.widget.ImageView imageView3 = card.findViewById(R.id.postImage3);

        avatarView.setText(avatar);
        usernameView.setText(username);
        timeView.setText(time);
        titleView.setText(title);
        contentView.setText(content);
        // 根据点赞状态设置UI
        likeBtn.setText((isLikedByUser ? "❤️ " : "👍 ") + likes);
        commentBtn.setText("💬 " + comments);

        // 设置公交标签
        if (!busTag.isEmpty()) {
            busTagView.setVisibility(View.VISIBLE);
            busTagView.setText(busTag);
        } else {
            busTagView.setVisibility(View.GONE);
        }

        // 设置图片（支持多张）
        if (!imageEmoji.isEmpty()) {
            String[] images = imageEmoji.split(",");
            imageContainer.setVisibility(View.VISIBLE);

            // 第一张图片
            if (images.length >= 1 && images[0].startsWith("http")) {
                imageView1.setVisibility(View.VISIBLE);
                loadImageFromUrl(images[0], imageView1);
            } else if (images.length >= 1) {
                // 如果不是URL,当作emoji显示
                imageView1.setVisibility(View.VISIBLE);
                imageView1.setImageBitmap(null);
            } else {
                imageView1.setVisibility(View.GONE);
            }

            // 第二张图片
            if (images.length >= 2 && images[1].startsWith("http")) {
                imageView2.setVisibility(View.VISIBLE);
                loadImageFromUrl(images[1], imageView2);
            } else if (images.length >= 2) {
                imageView2.setVisibility(View.VISIBLE);
                imageView2.setImageBitmap(null);
            } else {
                imageView2.setVisibility(View.GONE);
            }

            // 第三张图片
            if (images.length >= 3 && images[2].startsWith("http")) {
                imageView3.setVisibility(View.VISIBLE);
                loadImageFromUrl(images[2], imageView3);
            } else if (images.length >= 3) {
                imageView3.setVisibility(View.VISIBLE);
                imageView3.setImageBitmap(null);
            } else {
                imageView3.setVisibility(View.GONE);
            }
        } else {
            imageContainer.setVisibility(View.GONE);
        }

        // 设置点击事件
        final boolean[] isLiked = {isLikedByUser};
        final int[] currentLikes = {Integer.parseInt(likes)};

        likeBtn.setOnClickListener(v -> {
            isLiked[0] = !isLiked[0];
            boolean willLike = isLiked[0];

            // 先更新UI（乐观更新）
            if (willLike) {
                likeBtn.setText("❤️ " + (currentLikes[0] + 1));
            } else {
                likeBtn.setText("👍 " + currentLikes[0]);
            }

            // 调用后端API保存点赞状态
            String userId = userManager.getUserId();
            ApiClient.likePost(postId, userId, willLike, new ApiClient.LikePostCallback() {
                @Override
                public void onSuccess(int likes) {
                    runOnUiThread(() -> {
                        // 更新点赞数
                        currentLikes[0] = likes;
                        if (isLiked[0]) {
                            likeBtn.setText("❤️ " + likes);
                            Toast.makeText(MainActivity.this, "已点赞", Toast.LENGTH_SHORT).show();
                        } else {
                            likeBtn.setText("👍 " + likes);
                            Toast.makeText(MainActivity.this, "取消点赞", Toast.LENGTH_SHORT).show();
                        }
                    });
                }

                @Override
                public void onFailure(String error) {
                    runOnUiThread(() -> {
                        // 失败时恢复UI
                        isLiked[0] = !isLiked[0];
                        if (isLiked[0]) {
                            likeBtn.setText("❤️ " + (currentLikes[0] + 1));
                        } else {
                            likeBtn.setText("👍 " + currentLikes[0]);
                        }
                        Toast.makeText(MainActivity.this, "操作失败: " + error, Toast.LENGTH_SHORT).show();
                    });
                }
            });
        });

        commentBtn.setOnClickListener(v -> Toast.makeText(this, "评论功能开发中", Toast.LENGTH_SHORT).show());
        card.setOnClickListener(v -> Toast.makeText(this, "查看帖子详情", Toast.LENGTH_SHORT).show());

        return card;
    }

    // 显示发布帖子弹窗
    private void showPublishDialog() {
        // 重置选中的图片
        selectedImages.clear();

        Dialog dialog = new Dialog(this);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.dialog_publish_post);
        dialog.setCancelable(true);

        Window window = dialog.getWindow();
        if (window != null) {
            window.setLayout(
                (int) (getResources().getDisplayMetrics().widthPixels * 0.9),
                LinearLayout.LayoutParams.WRAP_CONTENT
            );
            window.setBackgroundDrawableResource(android.R.color.transparent);
        }

        android.widget.EditText etTitle = dialog.findViewById(R.id.etPostTitle);
        android.widget.EditText etContent = dialog.findViewById(R.id.etPostContent);
        TextView btnAddImage = dialog.findViewById(R.id.btnAddImage);
        TextView btnSelectBus = dialog.findViewById(R.id.btnSelectBus);
        LinearLayout selectedBusContainer = dialog.findViewById(R.id.selectedBusContainer);
        LinearLayout imagePreviewContainer = dialog.findViewById(R.id.imagePreviewContainer);
        TextView btnCancel = dialog.findViewById(R.id.btnCancelPost);
        TextView btnConfirm = dialog.findViewById(R.id.btnConfirmPost);

        // 选中的车次列表
        final java.util.ArrayList<String> selectedBusList = new java.util.ArrayList<>();

        // 保存当前对话框引用
        currentPublishDialog = dialog;
        currentImagePreviewContainer = imagePreviewContainer;
        currentEtTitle = etTitle;
        currentEtContent = etContent;
        currentSelectedBusList = selectedBusList;

        // 如果已连接WiFi，默认选择当前车次（5路）
        if (isConnected) {
            selectedBusList.add("5路");
            updateSelectedBusUI(selectedBusContainer, selectedBusList);
        }

        // 添加图片按钮
        btnAddImage.setOnClickListener(v -> {
            if (selectedImages.size() < 3) {
                openImagePicker();
            } else {
                Toast.makeText(this, "最多只能添加3张图片", Toast.LENGTH_SHORT).show();
            }
        });

        // 选择车次按钮
        btnSelectBus.setOnClickListener(v -> {
            showBusSelectionDialog(dialog, selectedBusList, selectedBusContainer);
        });

        // 取消
        btnCancel.setOnClickListener(v -> dialog.dismiss());

        // 发布
        btnConfirm.setOnClickListener(v -> {
            String title = etTitle.getText().toString().trim();
            String content = etContent.getText().toString().trim();

            if (title.isEmpty()) {
                Toast.makeText(this, "请输入帖子标题", Toast.LENGTH_SHORT).show();
                return;
            }

            if (content.isEmpty()) {
                Toast.makeText(this, "请输入帖子内容", Toast.LENGTH_SHORT).show();
                return;
            }

            // 获取选中的车次标签
            String busTag = "";
            if (!selectedBusList.isEmpty()) {
                busTag = selectedBusList.get(0);  // 只取第一个车次
            }

            // 发布帖子
            publishNewPost(title, content, busTag);
        });

        dialog.show();
    }

    // 显示车次选择对话框
    private void showBusSelectionDialog(Dialog parentDialog, java.util.ArrayList<String> selectedBusList, LinearLayout selectedBusContainer) {
        Dialog dialog = new Dialog(this);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);

        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setBackgroundColor(0xFFFFFFFF);
        layout.setPadding(40, 40, 40, 40);

        // 标题
        TextView title = new TextView(this);
        title.setText("选择车次（单选）");
        title.setTextSize(18);
        title.setTextColor(0xFF000000);
        title.getPaint().setFakeBoldText(true);
        LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        titleParams.setMargins(0, 0, 0, (int)(24 * getResources().getDisplayMetrics().density));
        title.setLayoutParams(titleParams);
        layout.addView(title);

        // 为每个历史车次创建单选按钮
        final int[] selectedIndex = {-1};
        final LinearLayout[] itemLayouts = new LinearLayout[connectedBusHistory.size()];
        final TextView[] checkBoxes = new TextView[connectedBusHistory.size()];

        // 查找已选中的车次索引
        for (int i = 0; i < connectedBusHistory.size(); i++) {
            if (selectedBusList.contains(connectedBusHistory.get(i))) {
                selectedIndex[0] = i;
                break;
            }
        }

        for (int i = 0; i < connectedBusHistory.size(); i++) {
            final int index = i;
            final String busName = connectedBusHistory.get(i);

            LinearLayout itemLayout = new LinearLayout(this);
            itemLayout.setOrientation(LinearLayout.HORIZONTAL);
            itemLayout.setGravity(Gravity.CENTER_VERTICAL);
            itemLayout.setPadding(20, 20, 20, 20);
            itemLayout.setBackgroundColor(selectedIndex[0] == index ? 0xFFFFF3E0 : 0xFFF5F5F5);
            LinearLayout.LayoutParams itemParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            );
            itemParams.setMargins(0, 0, 0, (int)(12 * getResources().getDisplayMetrics().density));
            itemLayout.setLayoutParams(itemParams);

            TextView busText = new TextView(this);
            busText.setText(busName + "公交");
            busText.setTextSize(16);
            busText.setTextColor(0xFF000000);
            LinearLayout.LayoutParams textParams = new LinearLayout.LayoutParams(
                0,
                LinearLayout.LayoutParams.WRAP_CONTENT,
                1f
            );
            busText.setLayoutParams(textParams);
            itemLayout.addView(busText);

            TextView checkBox = new TextView(this);
            checkBox.setText(selectedIndex[0] == index ? "✓" : "");
            checkBox.setTextSize(20);
            checkBox.setTextColor(0xFFFF5722);
            checkBox.getPaint().setFakeBoldText(true);
            itemLayout.addView(checkBox);

            itemLayouts[index] = itemLayout;
            checkBoxes[index] = checkBox;

            itemLayout.setOnClickListener(v -> {
                // 取消之前选中的
                if (selectedIndex[0] >= 0 && selectedIndex[0] < itemLayouts.length) {
                    itemLayouts[selectedIndex[0]].setBackgroundColor(0xFFF5F5F5);
                    checkBoxes[selectedIndex[0]].setText("");
                }

                // 选中当前项
                selectedIndex[0] = index;
                itemLayout.setBackgroundColor(0xFFFFF3E0);
                checkBox.setText("✓");
            });

            layout.addView(itemLayout);
        }

        // 确认按钮
        TextView confirmBtn = new TextView(this);
        confirmBtn.setText("确认");
        confirmBtn.setTextSize(16);
        confirmBtn.setTextColor(0xFFFFFFFF);
        confirmBtn.setGravity(Gravity.CENTER);
        confirmBtn.setBackgroundResource(R.drawable.button_rounded);
        LinearLayout.LayoutParams confirmParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            (int)(48 * getResources().getDisplayMetrics().density)
        );
        confirmParams.setMargins(0, (int)(24 * getResources().getDisplayMetrics().density), 0, 0);
        confirmBtn.setLayoutParams(confirmParams);
        confirmBtn.setClickable(true);
        confirmBtn.setFocusable(true);

        confirmBtn.setOnClickListener(v -> {
            // 更新选中列表（单选）
            selectedBusList.clear();
            if (selectedIndex[0] >= 0 && selectedIndex[0] < connectedBusHistory.size()) {
                selectedBusList.add(connectedBusHistory.get(selectedIndex[0]));
            }

            // 更新UI
            updateSelectedBusUI(selectedBusContainer, selectedBusList);
            dialog.dismiss();
        });

        layout.addView(confirmBtn);

        dialog.setContentView(layout);
        Window window = dialog.getWindow();
        if (window != null) {
            window.setLayout(
                (int) (getResources().getDisplayMetrics().widthPixels * 0.85),
                LinearLayout.LayoutParams.WRAP_CONTENT
            );
            window.setBackgroundDrawableResource(android.R.color.transparent);
        }

        dialog.show();
    }

    // 更新选中车次的UI显示
    private void updateSelectedBusUI(LinearLayout container, java.util.ArrayList<String> selectedBusList) {
        container.removeAllViews();

        if (selectedBusList.isEmpty()) {
            container.setVisibility(View.GONE);
            return;
        }

        container.setVisibility(View.VISIBLE);
        float density = getResources().getDisplayMetrics().density;

        for (String busName : selectedBusList) {
            TextView tag = new TextView(this);
            tag.setText(busName);
            tag.setTextSize(13);
            tag.setTextColor(0xFFFF5722);
            tag.setBackgroundColor(0xFFFFF3E0);
            tag.setPadding((int)(10*density), (int)(4*density), (int)(10*density), (int)(4*density));

            LinearLayout.LayoutParams tagParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            );
            tagParams.setMargins(0, 0, (int)(8*density), 0);
            tag.setLayoutParams(tagParams);

            container.addView(tag);
        }
    }

    // 打开图片选择器
    private void openImagePicker() {
        Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        intent.setType("image/*");
        startActivityForResult(intent, PICK_IMAGE_REQUEST);
    }

    // 处理图片选择结果
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == PICK_IMAGE_REQUEST && resultCode == RESULT_OK && data != null) {
            Uri selectedImageUri = data.getData();
            if (selectedImageUri != null && currentImagePreviewContainer != null) {
                selectedImages.add(selectedImageUri);
                updateImagePreview();
                Toast.makeText(this, "已添加图片", Toast.LENGTH_SHORT).show();
            }
        }
    }

    // 更新图片预览
    private void updateImagePreview() {
        if (currentImagePreviewContainer == null) return;

        currentImagePreviewContainer.removeAllViews();

        if (selectedImages.isEmpty()) {
            currentImagePreviewContainer.setVisibility(View.GONE);
            return;
        }

        currentImagePreviewContainer.setVisibility(View.VISIBLE);
        float density = getResources().getDisplayMetrics().density;

        for (int i = 0; i < selectedImages.size(); i++) {
            final int index = i;
            final Uri imageUri = selectedImages.get(i);

            RelativeLayout imageWrapper = new RelativeLayout(this);
            LinearLayout.LayoutParams wrapperParams = new LinearLayout.LayoutParams(
                (int)(80 * density),
                (int)(80 * density)
            );
            wrapperParams.setMargins(0, 0, (int)(8 * density), 0);
            imageWrapper.setLayoutParams(wrapperParams);

            // 真实图片预览
            ImageView imageView = new ImageView(this);
            imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);
            imageView.setBackgroundColor(0xFFF5F5F5);
            RelativeLayout.LayoutParams imageParams = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.MATCH_PARENT,
                RelativeLayout.LayoutParams.MATCH_PARENT
            );
            imageView.setLayoutParams(imageParams);

            // 加载图片
            try {
                InputStream inputStream = getContentResolver().openInputStream(imageUri);
                Bitmap bitmap = BitmapFactory.decodeStream(inputStream);
                imageView.setImageBitmap(bitmap);
                if (inputStream != null) {
                    inputStream.close();
                }
            } catch (Exception e) {
                // 加载失败时显示占位符
                imageView.setImageResource(android.R.drawable.ic_menu_gallery);
            }

            // 删除按钮
            TextView deleteBtn = new TextView(this);
            deleteBtn.setText("×");
            deleteBtn.setTextSize(16);
            deleteBtn.setTextColor(0xFFFFFFFF);
            deleteBtn.setBackgroundColor(0x88000000);
            deleteBtn.setGravity(Gravity.CENTER);
            RelativeLayout.LayoutParams deleteParams = new RelativeLayout.LayoutParams(
                (int)(24 * density),
                (int)(24 * density)
            );
            deleteParams.addRule(RelativeLayout.ALIGN_PARENT_END);
            deleteParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
            deleteBtn.setLayoutParams(deleteParams);
            deleteBtn.setClickable(true);
            deleteBtn.setFocusable(true);

            deleteBtn.setOnClickListener(v -> {
                selectedImages.remove(index);
                updateImagePreview();
            });

            imageWrapper.addView(imageView);
            imageWrapper.addView(deleteBtn);
            currentImagePreviewContainer.addView(imageWrapper);
        }
    }

    // 发布新帖子
    private void publishNewPost(String title, String content, String busTag) {
        if (currentPublishDialog != null) {
            currentPublishDialog.dismiss();
        }

        // 显示发布中提示
        Toast.makeText(this, "正在发布...", Toast.LENGTH_SHORT).show();

        // 如果有图片，先上传图片到后端
        if (!selectedImages.isEmpty()) {
            java.util.List<String> imageUrls = new java.util.ArrayList<>();
            final int[] uploadCount = {0};
            final int totalImages = selectedImages.size();

            for (Uri imageUri : selectedImages) {
                ApiClient.uploadImage(imageUri, this, new ApiClient.UploadCallback() {
                    @Override
                    public void onSuccess(String imageUrl) {
                        imageUrls.add(imageUrl);
                        uploadCount[0]++;

                        // 所有图片上传完成后，创建帖子
                        if (uploadCount[0] == totalImages) {
                            createPost(title, content, busTag, imageUrls);
                        }
                    }

                    @Override
                    public void onFailure(String error) {
                        runOnUiThread(() -> {
                            Toast.makeText(MainActivity.this, "图片上传失败: " + error, Toast.LENGTH_SHORT).show();
                        });
                    }
                });
            }
        } else {
            // 没有图片，直接创建帖子
            createPost(title, content, busTag, null);
        }

        // 清空选中的图片
        selectedImages.clear();
    }

    private void createPost(String title, String content, String busTag, java.util.List<String> imageUrls) {
        // 获取当前用户信息
        String userId = userManager.getUserId();
        String username = userManager.getNickname();
        String avatar = userManager.getAvatar();

        ApiClient.createPost(title, content, busTag, imageUrls, userId, username, avatar, new ApiClient.CreatePostCallback() {
            @Override
            public void onSuccess(String postId) {
                runOnUiThread(() -> {
                    Toast.makeText(MainActivity.this, "发布成功", Toast.LENGTH_SHORT).show();

                    // 重新加载帖子列表
                    loadPostsFromBackend();
                });
            }

            @Override
            public void onFailure(String error) {
                runOnUiThread(() -> {
                    Toast.makeText(MainActivity.this, "发布失败: " + error, Toast.LENGTH_SHORT).show();
                });
            }
        });
    }

    // 从后端加载帖子列表
    private void loadPostsFromBackend() {
        String currentUserId = userManager.getUserId();
        ApiClient.getPosts(currentUserId, new ApiClient.GetPostsCallback() {
            @Override
            public void onSuccess(java.util.List<java.util.Map<String, Object>> posts) {
                runOnUiThread(() -> {
                    // 停止刷新动画
                    if (swipeRefreshLayout != null) {
                        swipeRefreshLayout.setRefreshing(false);
                    }

                    // 清空现有帖子
                    discoverPostList.removeAllViews();

                    // 添加帖子卡片
                    for (java.util.Map<String, Object> postData : posts) {
                        String postId = (String) postData.get("post_id");
                        String avatar = (String) postData.get("avatar");
                        String username = (String) postData.get("username");
                        long timestamp = (Long) postData.get("timestamp");
                        String title = (String) postData.get("title");
                        String content = (String) postData.get("content");
                        String busTag = (String) postData.get("bus_tag");
                        long likes = (Long) postData.get("likes");
                        long comments = (Long) postData.get("comments");
                        String imageUrls = (String) postData.get("image_urls");
                        boolean isLiked = (Boolean) postData.getOrDefault("is_liked", false);

                        // 计算时间差
                        String timeText = formatTimeAgo(timestamp);

                        // 将图片URL转换为显示格式（用于显示图片缩略图）
                        String imageDisplay = "";
                        if (imageUrls != null && !imageUrls.isEmpty()) {
                            // 这里简化处理，实际应该根据URL加载图片
                            String[] urls = imageUrls.split(",");
                            imageDisplay = String.join(",", java.util.Arrays.copyOf(urls, Math.min(urls.length, 3)));
                        }

                        View postCard = createPostCard(
                            postId,
                            avatar,
                            username,
                            timeText,
                            title,
                            content,
                            busTag,
                            String.valueOf(likes),
                            String.valueOf(comments),
                            imageDisplay,
                            isLiked
                        );

                        discoverPostList.addView(postCard);
                    }
                });
            }

            @Override
            public void onFailure(String error) {
                runOnUiThread(() -> {
                    // 停止刷新动画
                    if (swipeRefreshLayout != null) {
                        swipeRefreshLayout.setRefreshing(false);
                    }
                    Toast.makeText(MainActivity.this, "加载帖子失败: " + error, Toast.LENGTH_SHORT).show();
                });
            }
        });
    }

    // 格式化时间为"xx前"的形式
    private String formatTimeAgo(long timestamp) {
        long now = System.currentTimeMillis();
        long diff = now - timestamp;

        long seconds = diff / 1000;
        long minutes = seconds / 60;
        long hours = minutes / 60;
        long days = hours / 24;

        if (seconds < 60) {
            return "刚刚";
        } else if (minutes < 60) {
            return minutes + "分钟前";
        } else if (hours < 24) {
            return hours + "小时前";
        } else if (days < 30) {
            return days + "天前";
        } else {
            return "很久之前";
        }
    }

    // 从URL加载图片
    private void loadImageFromUrl(String imageUrl, android.widget.ImageView imageView) {
        new Thread(() -> {
            try {
                java.net.URL url = new java.net.URL(imageUrl);
                java.net.HttpURLConnection connection = (java.net.HttpURLConnection) url.openConnection();
                connection.setDoInput(true);
                connection.connect();
                java.io.InputStream input = connection.getInputStream();
                android.graphics.Bitmap bitmap = android.graphics.BitmapFactory.decodeStream(input);
                runOnUiThread(() -> {
                    if (bitmap != null) {
                        imageView.setImageBitmap(bitmap);
                    }
                });
            } catch (Exception e) {
                e.printStackTrace();
                runOnUiThread(() -> {
                    // 加载失败时显示灰色背景
                    imageView.setImageBitmap(null);
                });
            }
        }).start();
    }

    // 显示欢迎弹窗
    private void showWelcomeDialog() {
        Dialog dialog = new Dialog(this);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setCancelable(false); // 必须选择

        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setBackgroundColor(0xFFFFFFFF);
        layout.setPadding(50, 50, 50, 50);
        layout.setGravity(Gravity.CENTER);

        // 欢迎标题
        TextView title = new TextView(this);
        title.setText("欢迎使用出行宝！");
        title.setTextSize(22);
        title.setTextColor(0xFF000000);
        title.getPaint().setFakeBoldText(true);
        title.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        titleParams.setMargins(0, 0, 0, (int)(30 * getResources().getDisplayMetrics().density));
        title.setLayoutParams(titleParams);
        layout.addView(title);

        // 头像显示
        TextView avatarView = new TextView(this);
        avatarView.setText(userManager.getAvatar());
        avatarView.setTextSize(60);
        avatarView.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams avatarParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        avatarParams.setMargins(0, 0, 0, (int)(20 * getResources().getDisplayMetrics().density));
        avatarView.setLayoutParams(avatarParams);
        layout.addView(avatarView);

        // 昵称显示
        TextView nicknameView = new TextView(this);
        nicknameView.setText("你好，" + userManager.getNickname() + "！");
        nicknameView.setTextSize(18);
        nicknameView.setTextColor(0xFF333333);
        nicknameView.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams nicknameParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        nicknameParams.setMargins(0, 0, 0, (int)(30 * getResources().getDisplayMetrics().density));
        nicknameView.setLayoutParams(nicknameParams);
        layout.addView(nicknameView);

        // 说明文字
        TextView desc = new TextView(this);
        desc.setText("我们为您随机生成了昵称和头像\n设置后即可查看车友的互动消息\n您可以在【我的】页面修改");
        desc.setTextSize(14);
        desc.setTextColor(0xFF666666);
        desc.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams descParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        descParams.setMargins(0, 0, 0, (int)(40 * getResources().getDisplayMetrics().density));
        desc.setLayoutParams(descParams);
        layout.addView(desc);

        // 按钮容器
        LinearLayout buttonContainer = new LinearLayout(this);
        buttonContainer.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams buttonContainerParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        buttonContainer.setLayoutParams(buttonContainerParams);

        // 换一个按钮
        TextView btnChange = new TextView(this);
        btnChange.setText("换一个");
        btnChange.setTextSize(16);
        btnChange.setTextColor(0xFF666666);
        btnChange.setBackground(getResources().getDrawable(R.drawable.button_rounded_outline));
        btnChange.setGravity(Gravity.CENTER);
        btnChange.setPadding(0, 30, 0, 30);
        LinearLayout.LayoutParams btnChangeParams = new LinearLayout.LayoutParams(
            0,
            LinearLayout.LayoutParams.WRAP_CONTENT,
            1
        );
        btnChangeParams.setMargins(0, 0, (int)(10 * getResources().getDisplayMetrics().density), 0);
        btnChange.setLayoutParams(btnChangeParams);
        btnChange.setClickable(true);
        btnChange.setFocusable(true);

        // 确认使用按钮
        TextView btnConfirm = new TextView(this);
        btnConfirm.setText("确认使用");
        btnConfirm.setTextSize(16);
        btnConfirm.setTextColor(0xFFFFFFFF);
        btnConfirm.getPaint().setFakeBoldText(true);
        btnConfirm.setBackground(getResources().getDrawable(R.drawable.button_rounded));
        btnConfirm.setGravity(Gravity.CENTER);
        btnConfirm.setPadding(0, 30, 0, 30);
        LinearLayout.LayoutParams btnConfirmParams = new LinearLayout.LayoutParams(
            0,
            LinearLayout.LayoutParams.WRAP_CONTENT,
            1
        );
        btnConfirmParams.setMargins((int)(10 * getResources().getDisplayMetrics().density), 0, 0, 0);
        btnConfirm.setLayoutParams(btnConfirmParams);
        btnConfirm.setClickable(true);
        btnConfirm.setFocusable(true);

        // 换一个按钮点击事件
        btnChange.setOnClickListener(v -> {
            // 在后台线程生成唯一昵称
            new Thread(() -> {
                String newNickname = userManager.generateUniqueNickname();
                String newAvatar = userManager.generateRandomAvatar();
                userManager.saveUserInfo(newNickname, newAvatar);

                runOnUiThread(() -> {
                    avatarView.setText(newAvatar);
                    nicknameView.setText("你好，" + newNickname + "！");
                });
            }).start();
        });

        // 确认按钮点击事件
        btnConfirm.setOnClickListener(v -> {
            // 标记首次启动完成
            userManager.setFirstLaunchCompleted();

            // 同步到服务器
            userManager.syncToServer(new UserManager.SyncCallback() {
                @Override
                public void onSuccess() {
                    runOnUiThread(() -> {
                        Toast.makeText(MainActivity.this, "欢迎使用出行宝！", Toast.LENGTH_SHORT).show();
                    });
                }

                @Override
                public void onFailure(String error) {
                    runOnUiThread(() -> {
                        Toast.makeText(MainActivity.this, "同步失败，请检查网络", Toast.LENGTH_SHORT).show();
                    });
                }
            });

            dialog.dismiss();
        });

        buttonContainer.addView(btnChange);
        buttonContainer.addView(btnConfirm);
        layout.addView(buttonContainer);

        dialog.setContentView(layout);
        dialog.show();
    }

    // 更新我的页面数据
    private void updateProfilePage() {
        profileAvatar.setText(userManager.getAvatar());
        profileNickname.setText(userManager.getNickname());
        profileUserId.setText("ID: " + userManager.getUserId().substring(0, 8));
        // TODO: 从服务器获取统计数据
        profilePostCount.setText("0");
        profileLikeCount.setText("0");
        profileCollectCount.setText("0");
    }

    // 显示编辑资料弹窗
    private void showProfileEditDialog() {
        Dialog dialog = new Dialog(this);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);

        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(60, 60, 60, 60);
        layout.setBackgroundColor(0xFFFFFFFF);

        // 标题
        TextView title = new TextView(this);
        title.setText("编辑资料");
        title.setTextSize(20);
        title.setTypeface(null, android.graphics.Typeface.BOLD);
        title.setTextColor(0xFF333333);
        title.setGravity(android.view.Gravity.CENTER);
        LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        titleParams.bottomMargin = 40;
        layout.addView(title, titleParams);

        // 昵称标签
        TextView nicknameLabel = new TextView(this);
        nicknameLabel.setText("昵称");
        nicknameLabel.setTextSize(14);
        nicknameLabel.setTextColor(0xFF666666);
        LinearLayout.LayoutParams labelParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        labelParams.bottomMargin = 12;
        layout.addView(nicknameLabel, labelParams);

        // 昵称输入框
        android.widget.EditText nicknameInput = new android.widget.EditText(this);
        nicknameInput.setText(userManager.getNickname());
        nicknameInput.setTextSize(16);
        nicknameInput.setTextColor(0xFF333333);
        nicknameInput.setPadding(30, 30, 30, 30);
        nicknameInput.setBackgroundColor(0xFFF5F5F5);
        LinearLayout.LayoutParams inputParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        inputParams.bottomMargin = 50;
        layout.addView(nicknameInput, inputParams);

        // 按钮容器
        LinearLayout buttonContainer = new LinearLayout(this);
        buttonContainer.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams containerParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        layout.addView(buttonContainer, containerParams);

        // 取消按钮
        TextView btnCancel = new TextView(this);
        btnCancel.setText("取消");
        btnCancel.setTextSize(16);
        btnCancel.setTextColor(0xFF666666);
        btnCancel.setGravity(android.view.Gravity.CENTER);
        btnCancel.setPadding(0, 30, 0, 30);
        btnCancel.setBackgroundColor(0xFFF0F0F0);
        LinearLayout.LayoutParams cancelParams = new LinearLayout.LayoutParams(
            0,
            LinearLayout.LayoutParams.WRAP_CONTENT,
            1.0f
        );
        cancelParams.rightMargin = 20;
        btnCancel.setClickable(true);
        btnCancel.setFocusable(true);
        buttonContainer.addView(btnCancel, cancelParams);

        // 保存按钮
        TextView btnSave = new TextView(this);
        btnSave.setText("保存");
        btnSave.setTextSize(16);
        btnSave.setTextColor(0xFFFFFFFF);
        btnSave.setGravity(android.view.Gravity.CENTER);
        btnSave.setPadding(0, 30, 0, 30);
        btnSave.setBackgroundColor(0xFF2196F3);
        LinearLayout.LayoutParams saveParams = new LinearLayout.LayoutParams(
            0,
            LinearLayout.LayoutParams.WRAP_CONTENT,
            1.0f
        );
        btnSave.setClickable(true);
        btnSave.setFocusable(true);
        buttonContainer.addView(btnSave, saveParams);

        // 取消按钮点击事件
        btnCancel.setOnClickListener(v -> dialog.dismiss());

        // 保存按钮点击事件
        btnSave.setOnClickListener(v -> {
            String newNickname = nicknameInput.getText().toString().trim();
            if (newNickname.isEmpty()) {
                Toast.makeText(this, "昵称不能为空", Toast.LENGTH_SHORT).show();
                return;
            }

            userManager.saveUserInfo(newNickname, userManager.getAvatar());
            userManager.syncToServer(new UserManager.SyncCallback() {
                @Override
                public void onSuccess() {
                    runOnUiThread(() -> {
                        Toast.makeText(MainActivity.this, "保存成功", Toast.LENGTH_SHORT).show();
                        updateProfilePage();
                        dialog.dismiss();
                    });
                }
                @Override
                public void onFailure(String error) {
                    runOnUiThread(() -> {
                        Toast.makeText(MainActivity.this, "同步失败: " + error, Toast.LENGTH_SHORT).show();
                        dialog.dismiss();
                    });
                }
            });
        });

        dialog.setContentView(layout);
        dialog.getWindow().setLayout(
            (int) (getResources().getDisplayMetrics().widthPixels * 0.85),
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        dialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialog.show();
    }

    // 显示个人资料弹窗（已废弃，保留用于兼容）
    private void showProfileDialog() {
        Dialog dialog = new Dialog(this);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);

        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setBackgroundColor(0xFFFFFFFF);
        layout.setPadding(50, 50, 50, 50);

        // 标题
        TextView title = new TextView(this);
        title.setText("个人资料");
        title.setTextSize(20);
        title.setTextColor(0xFF000000);
        title.getPaint().setFakeBoldText(true);
        title.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        titleParams.setMargins(0, 0, 0, (int)(30 * getResources().getDisplayMetrics().density));
        title.setLayoutParams(titleParams);
        layout.addView(title);

        // 头像显示（可点击更换）
        TextView avatarView = new TextView(this);
        avatarView.setText(userManager.getAvatar());
        avatarView.setTextSize(80);
        avatarView.setGravity(Gravity.CENTER);
        avatarView.setBackground(getResources().getDrawable(R.drawable.button_rounded_outline));
        avatarView.setPadding(20, 20, 20, 20);
        LinearLayout.LayoutParams avatarParams = new LinearLayout.LayoutParams(
            (int)(120 * getResources().getDisplayMetrics().density),
            (int)(120 * getResources().getDisplayMetrics().density)
        );
        avatarParams.gravity = Gravity.CENTER_HORIZONTAL;
        avatarParams.setMargins(0, 0, 0, (int)(10 * getResources().getDisplayMetrics().density));
        avatarView.setLayoutParams(avatarParams);
        avatarView.setClickable(true);
        avatarView.setFocusable(true);
        layout.addView(avatarView);

        // 更换头像提示
        TextView avatarHint = new TextView(this);
        avatarHint.setText("点击更换头像");
        avatarHint.setTextSize(12);
        avatarHint.setTextColor(0xFF999999);
        avatarHint.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams avatarHintParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        avatarHintParams.setMargins(0, 0, 0, (int)(30 * getResources().getDisplayMetrics().density));
        avatarHint.setLayoutParams(avatarHintParams);
        layout.addView(avatarHint);

        // 昵称标签
        TextView nicknameLabel = new TextView(this);
        nicknameLabel.setText("昵称");
        nicknameLabel.setTextSize(14);
        nicknameLabel.setTextColor(0xFF666666);
        LinearLayout.LayoutParams nicknameLabelParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        nicknameLabelParams.setMargins(0, 0, 0, (int)(8 * getResources().getDisplayMetrics().density));
        nicknameLabel.setLayoutParams(nicknameLabelParams);
        layout.addView(nicknameLabel);

        // 昵称输入框
        android.widget.EditText nicknameInput = new android.widget.EditText(this);
        nicknameInput.setText(userManager.getNickname());
        nicknameInput.setTextSize(16);
        nicknameInput.setTextColor(0xFF000000);
        nicknameInput.setBackground(getResources().getDrawable(R.drawable.button_rounded_outline));
        nicknameInput.setPadding(20, 20, 20, 20);
        nicknameInput.setSingleLine(true);
        nicknameInput.setMaxLines(1);
        LinearLayout.LayoutParams nicknameInputParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        nicknameInputParams.setMargins(0, 0, 0, (int)(30 * getResources().getDisplayMetrics().density));
        nicknameInput.setLayoutParams(nicknameInputParams);
        layout.addView(nicknameInput);

        // 用户ID显示
        TextView userIdLabel = new TextView(this);
        userIdLabel.setText("用户ID: " + userManager.getUserId().substring(0, 8) + "...");
        userIdLabel.setTextSize(12);
        userIdLabel.setTextColor(0xFF999999);
        userIdLabel.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams userIdLabelParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        userIdLabelParams.setMargins(0, 0, 0, (int)(40 * getResources().getDisplayMetrics().density));
        userIdLabel.setLayoutParams(userIdLabelParams);
        layout.addView(userIdLabel);

        // 按钮容器
        LinearLayout buttonContainer = new LinearLayout(this);
        buttonContainer.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams buttonContainerParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        buttonContainer.setLayoutParams(buttonContainerParams);

        // 取消按钮
        TextView btnCancel = new TextView(this);
        btnCancel.setText("取消");
        btnCancel.setTextSize(16);
        btnCancel.setTextColor(0xFF666666);
        btnCancel.setBackground(getResources().getDrawable(R.drawable.button_rounded_outline));
        btnCancel.setGravity(Gravity.CENTER);
        btnCancel.setPadding(0, 30, 0, 30);
        LinearLayout.LayoutParams btnCancelParams = new LinearLayout.LayoutParams(
            0,
            LinearLayout.LayoutParams.WRAP_CONTENT,
            1
        );
        btnCancelParams.setMargins(0, 0, (int)(10 * getResources().getDisplayMetrics().density), 0);
        btnCancel.setLayoutParams(btnCancelParams);
        btnCancel.setClickable(true);
        btnCancel.setFocusable(true);

        // 保存按钮
        TextView btnSave = new TextView(this);
        btnSave.setText("保存");
        btnSave.setTextSize(16);
        btnSave.setTextColor(0xFFFFFFFF);
        btnSave.getPaint().setFakeBoldText(true);
        btnSave.setBackground(getResources().getDrawable(R.drawable.button_rounded));
        btnSave.setGravity(Gravity.CENTER);
        btnSave.setPadding(0, 30, 0, 30);
        LinearLayout.LayoutParams btnSaveParams = new LinearLayout.LayoutParams(
            0,
            LinearLayout.LayoutParams.WRAP_CONTENT,
            1
        );
        btnSaveParams.setMargins((int)(10 * getResources().getDisplayMetrics().density), 0, 0, 0);
        btnSave.setLayoutParams(btnSaveParams);
        btnSave.setClickable(true);
        btnSave.setFocusable(true);

        // 点击头像更换
        avatarView.setOnClickListener(v -> {
            String newAvatar = userManager.generateRandomAvatar();
            avatarView.setText(newAvatar);
        });

        // 取消按钮
        btnCancel.setOnClickListener(v -> dialog.dismiss());

        // 保存按钮
        btnSave.setOnClickListener(v -> {
            String newNickname = nicknameInput.getText().toString().trim();
            String newAvatar = avatarView.getText().toString();

            if (newNickname.isEmpty()) {
                Toast.makeText(this, "昵称不能为空", Toast.LENGTH_SHORT).show();
                return;
            }

            // 保存到本地
            userManager.saveUserInfo(newNickname, newAvatar);

            // 同步到服务器
            userManager.syncToServer(new UserManager.SyncCallback() {
                @Override
                public void onSuccess() {
                    runOnUiThread(() -> {
                        Toast.makeText(MainActivity.this, "保存成功", Toast.LENGTH_SHORT).show();
                        dialog.dismiss();
                    });
                }

                @Override
                public void onFailure(String error) {
                    runOnUiThread(() -> {
                        Toast.makeText(MainActivity.this, "同步失败: " + error, Toast.LENGTH_SHORT).show();
                        // 即使同步失败，本地已保存，仍然关闭对话框
                        dialog.dismiss();
                    });
                }
            });
        });

        buttonContainer.addView(btnCancel);
        buttonContainer.addView(btnSave);
        layout.addView(buttonContainer);

        dialog.setContentView(layout);
        dialog.show();
    }

    /**
     * 显示我的发布页面
     */
    private void showMyPostsPage() {
        // 隐藏其他页面
        mainScrollView.setVisibility(View.GONE);
        discoverPage.setVisibility(View.GONE);
        profilePage.setVisibility(View.GONE);
        offersPage.setVisibility(View.GONE);
        aiChatPage.setVisibility(View.GONE);

        // 显示我的发布页面
        myPostsPage.setVisibility(View.VISIBLE);

        // 加载我的发布内容
        loadMyPosts();
    }

    /**
     * 加载我的发布的帖子
     */
    private void loadMyPosts() {
        new Thread(() -> {
            try {
                String userId = userManager.getUserId();
                URL url = new URL("http://101.37.70.167:3000/api/posts");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setConnectTimeout(5000);
                conn.setReadTimeout(5000);

                BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();

                JSONObject jsonResponse = new JSONObject(response.toString());
                JSONArray postsArray = jsonResponse.getJSONArray("posts");

                // 筛选出当前用户发布的帖子
                java.util.ArrayList<JSONObject> myPosts = new java.util.ArrayList<>();
                for (int i = 0; i < postsArray.length(); i++) {
                    JSONObject post = postsArray.getJSONObject(i);
                    String postUserId = post.optString("user_id", "");
                    if (postUserId.equals(userId)) {
                        myPosts.add(post);
                    }
                }

                runOnUiThread(() -> {
                    myPostsList.removeAllViews();

                    if (myPosts.isEmpty()) {
                        // 显示空状态
                        myPostsEmptyState.setVisibility(View.VISIBLE);
                        myPostsList.setVisibility(View.GONE);
                    } else {
                        // 显示帖子列表
                        myPostsEmptyState.setVisibility(View.GONE);
                        myPostsList.setVisibility(View.VISIBLE);

                        for (JSONObject post : myPosts) {
                            String avatar = post.optString("avatar", "👤");
                            String username = post.optString("username", "匿名用户");
                            String postId = post.optString("post_id", "");
                            String title = post.optString("title", "");
                            String content = post.optString("content", "");
                            String busTag = post.optString("bus_tag", "");
                            int likes = post.optInt("likes", 0);
                            int comments = post.optInt("comments", 0);
                            long timestamp = post.optLong("timestamp", 0);

                            // 格式化时间
                            String timeStr = formatTimeAgo(timestamp);

                            // 处理图片
                            String imageUrls = post.optString("image_urls", "");
                            String imageEmoji = "";
                            if (!imageUrls.isEmpty()) {
                                String[] urls = imageUrls.split(",");
                                imageEmoji = "📷 " + urls.length;
                            }

                            // 获取点赞状态
                            boolean isLiked = post.optBoolean("isLikedByUser", false);

                            View postView = createPostCard(
                                postId,
                                avatar,
                                username,
                                timeStr,
                                title,
                                content,
                                busTag,
                                String.valueOf(likes),
                                String.valueOf(comments),
                                imageEmoji,
                                isLiked
                            );
                            myPostsList.addView(postView);
                        }
                    }

                    myPostsSwipeRefresh.setRefreshing(false);
                    Log.d("MainActivity", "成功加载 " + myPosts.size() + " 条我的发布");
                });

                conn.disconnect();
            } catch (Exception e) {
                Log.e("MainActivity", "加载我的发布失败: " + e.getMessage());
                e.printStackTrace();
                runOnUiThread(() -> {
                    myPostsSwipeRefresh.setRefreshing(false);
                    Toast.makeText(MainActivity.this, "加载失败: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                });
            }
        }).start();
    }

    // 显示 AI 聊天页面
    private void showAiChatPage() {
        mainScrollView.setVisibility(View.GONE);
        discoverPage.setVisibility(View.GONE);
        profilePage.setVisibility(View.GONE);
        myPostsPage.setVisibility(View.GONE);
        offersPage.setVisibility(View.GONE);

        aiChatPage.setVisibility(View.VISIBLE);
    }

    // 发送 AI 消息
    private void sendAiMessage() {
        String userMessage = aiChatInput.getText().toString().trim();
        if (userMessage.isEmpty()) {
            Toast.makeText(this, "请输入消息", Toast.LENGTH_SHORT).show();
            return;
        }

        // 清空输入框
        aiChatInput.setText("");

        // 隐藏欢迎界面
        aiChatWelcome.setVisibility(View.GONE);

        // 添加用户消息到界面
        addUserMessage(userMessage);

        // 显示加载提示
        aiChatLoadingIndicator.setVisibility(View.VISIBLE);

        // 调用 AI API
        callAiApi(userMessage);
    }

    // 添加用户消息
    private void addUserMessage(String message) {
        View messageView = LayoutInflater.from(this).inflate(R.layout.item_chat_message_user, null);
        TextView messageText = messageView.findViewById(R.id.userMessageText);
        TextView messageTime = messageView.findViewById(R.id.userMessageTime);

        messageText.setText(message);
        messageTime.setText(formatTimeAgo(System.currentTimeMillis()));

        aiChatMessageList.addView(messageView);

        // 滚动到底部
        aiChatScrollView.post(() -> aiChatScrollView.fullScroll(View.FOCUS_DOWN));

        // 保存到历史
        chatHistory.add(new ChatMessage("user", message, System.currentTimeMillis()));
    }

    // 添加 AI 消息
    private void addAiMessage(String message) {
        View messageView = LayoutInflater.from(this).inflate(R.layout.item_chat_message_ai, null);
        TextView messageText = messageView.findViewById(R.id.aiMessageText);
        TextView messageTime = messageView.findViewById(R.id.aiMessageTime);

        messageText.setText(message);
        messageTime.setText(formatTimeAgo(System.currentTimeMillis()));

        aiChatMessageList.addView(messageView);

        // 滚动到底部
        aiChatScrollView.post(() -> aiChatScrollView.fullScroll(View.FOCUS_DOWN));

        // 保存到历史
        chatHistory.add(new ChatMessage("assistant", message, System.currentTimeMillis()));
    }

    // 调用 AI API
    private void callAiApi(String userMessage) {
        new Thread(() -> {
            try {
                URL url = new URL("http://101.37.70.167:3000/api/ai/chat");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);

                // 构建请求体
                JSONObject requestBody = new JSONObject();
                requestBody.put("message", userMessage);

                // 添加历史对话（最近5轮）
                JSONArray history = new JSONArray();
                int startIndex = Math.max(0, chatHistory.size() - 10); // 最多发送最近5轮对话（10条消息）
                for (int i = startIndex; i < chatHistory.size(); i++) {
                    ChatMessage msg = chatHistory.get(i);
                    JSONObject historyMsg = new JSONObject();
                    historyMsg.put("role", msg.getRole());
                    historyMsg.put("content", msg.getContent());
                    history.put(historyMsg);
                }
                requestBody.put("history", history);

                // 发送请求
                java.io.OutputStream os = conn.getOutputStream();
                os.write(requestBody.toString().getBytes("UTF-8"));
                os.close();

                // 读取响应
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
                    String aiReply = jsonResponse.getString("reply");

                    // 在主线程更新 UI
                    runOnUiThread(() -> {
                        aiChatLoadingIndicator.setVisibility(View.GONE);
                        addAiMessage(aiReply);
                    });
                } else {
                    // 读取错误信息
                    BufferedReader errorReader = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
                    StringBuilder errorResponse = new StringBuilder();
                    String line;
                    while ((line = errorReader.readLine()) != null) {
                        errorResponse.append(line);
                    }
                    errorReader.close();

                    Log.e("MainActivity", "AI API 错误: " + errorResponse.toString());

                    runOnUiThread(() -> {
                        aiChatLoadingIndicator.setVisibility(View.GONE);
                        addAiMessage("抱歉，我现在遇到了一些问题，请稍后再试。");
                    });
                }

                conn.disconnect();
            } catch (Exception e) {
                Log.e("MainActivity", "调用 AI API 失败: " + e.getMessage());
                e.printStackTrace();
                runOnUiThread(() -> {
                    aiChatLoadingIndicator.setVisibility(View.GONE);
                    addAiMessage("抱歉，网络连接失败，请检查网络设置。");
                });
            }
        }).start();
    }

    // ========== 首页AI聊天（金陵喵）相关方法 ==========

    // 发送首页 AI 消息
    private void sendHomeAiMessage() {
        String userMessage = homeAiInput.getText().toString().trim();
        if (userMessage.isEmpty()) {
            Toast.makeText(this, "请输入消息", Toast.LENGTH_SHORT).show();
            return;
        }

        // 展开对话框（如果是第一次发送消息）
        if (homeAiChatHistory.getVisibility() == View.GONE) {
            homeAiChatHistory.setVisibility(View.VISIBLE);
            android.view.ViewGroup.LayoutParams params = homeAiChatHistory.getLayoutParams();
            params.height = (int) (200 * getResources().getDisplayMetrics().density);
            homeAiChatHistory.setLayoutParams(params);

            // 设置底部margin
            if (params instanceof android.view.ViewGroup.MarginLayoutParams) {
                ((android.view.ViewGroup.MarginLayoutParams) params).bottomMargin = (int) (12 * getResources().getDisplayMetrics().density);
            }
        }

        // 清空输入框
        homeAiInput.setText("");

        // 添加用户消息到界面
        addHomeUserMessage(userMessage);

        // 调用 AI API
        callHomeAiApi(userMessage);
    }

    // 添加用户消息到首页
    private void addHomeUserMessage(String message) {
        View messageView = LayoutInflater.from(this).inflate(R.layout.item_chat_message_user, null);
        TextView messageText = messageView.findViewById(R.id.userMessageText);
        TextView messageTime = messageView.findViewById(R.id.userMessageTime);

        messageText.setText(message);
        messageTime.setText(formatTimeAgo(System.currentTimeMillis()));

        homeAiMessageList.addView(messageView);

        // 滚动到底部
        homeAiChatHistory.post(() -> homeAiChatHistory.fullScroll(View.FOCUS_DOWN));

        // 保存到历史
        homeAiChatMessages.add(new ChatMessage("user", message, System.currentTimeMillis()));
    }

    // 添加 AI 消息到首页
    private void addHomeAiMessage(String message) {
        View messageView = LayoutInflater.from(this).inflate(R.layout.item_chat_message_ai, null);
        TextView messageText = messageView.findViewById(R.id.aiMessageText);
        TextView messageTime = messageView.findViewById(R.id.aiMessageTime);

        messageText.setText(message);
        messageTime.setText(formatTimeAgo(System.currentTimeMillis()));

        homeAiMessageList.addView(messageView);

        // 滚动到底部
        homeAiChatHistory.post(() -> homeAiChatHistory.fullScroll(View.FOCUS_DOWN));

        // 保存到历史
        homeAiChatMessages.add(new ChatMessage("assistant", message, System.currentTimeMillis()));
    }

    // 调用 AI API（首页版本）
    private void callHomeAiApi(String userMessage) {
        new Thread(() -> {
            try {
                URL url = new URL("http://101.37.70.167:3000/api/ai/chat");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);

                // 构建请求体
                JSONObject requestBody = new JSONObject();
                requestBody.put("message", userMessage);

                // 添加历史对话（最近5轮）
                JSONArray history = new JSONArray();

                // 添加 system prompt（金陵喵的性格设定）
                JSONObject systemMsg = new JSONObject();
                systemMsg.put("role", "system");
                systemMsg.put("content", "你是一个古灵精怪的宠物小猫，但你拥有人类一样的智慧。你一直生活在南京，熟悉南京的各个公交线路、景点和吃喝玩乐。但你更擅长给坐车出行的人们提供情绪价值，让那些早晚高峰挤车的人、辛苦劳作的人、老年人、小孩子都感受到快乐和温暖。");
                history.put(systemMsg);

                int startIndex = Math.max(0, homeAiChatMessages.size() - 10); // 最多发送最近5轮对话（10条消息）
                for (int i = startIndex; i < homeAiChatMessages.size(); i++) {
                    ChatMessage msg = homeAiChatMessages.get(i);
                    JSONObject historyMsg = new JSONObject();
                    historyMsg.put("role", msg.getRole());
                    historyMsg.put("content", msg.getContent());
                    history.put(historyMsg);
                }
                requestBody.put("history", history);

                // 发送请求
                java.io.OutputStream os = conn.getOutputStream();
                os.write(requestBody.toString().getBytes("UTF-8"));
                os.close();

                // 读取响应
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
                    String aiReply = jsonResponse.getString("reply");

                    // 在主线程更新 UI
                    runOnUiThread(() -> {
                        addHomeAiMessage(aiReply);
                    });
                } else {
                    // 读取错误信息
                    BufferedReader errorReader = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
                    StringBuilder errorResponse = new StringBuilder();
                    String line;
                    while ((line = errorReader.readLine()) != null) {
                        errorResponse.append(line);
                    }
                    errorReader.close();

                    Log.e("MainActivity", "AI API 错误: " + errorResponse.toString());

                    runOnUiThread(() -> {
                        addHomeAiMessage("抱歉，我现在遇到了一些问题，请稍后再试。喵~");
                    });
                }

                conn.disconnect();
            } catch (Exception e) {
                Log.e("MainActivity", "调用 AI API 失败: " + e.getMessage());
                e.printStackTrace();
                runOnUiThread(() -> {
                    addHomeAiMessage("抱歉，网络连接失败，请检查网络设置。喵~");
                });
            }
        }).start();
    }

    /**
     * 显示语言选择对话框
     */
    private void showLanguageSelectionDialog() {
        Dialog dialog = new Dialog(this);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setCancelable(true);

        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setBackgroundColor(0xFFFFFFFF);
        layout.setPadding(60, 60, 60, 60);

        // 标题
        TextView title = new TextView(this);
        title.setText(R.string.language_settings);
        title.setTextSize(20);
        title.setTextColor(0xFF000000);
        title.getPaint().setFakeBoldText(true);
        title.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        titleParams.setMargins(0, 0, 0, (int)(30 * getResources().getDisplayMetrics().density));
        title.setLayoutParams(titleParams);
        layout.addView(title);

        // 当前选择的语言
        final String currentLanguage = LanguageHelper.getSavedLanguage(this);
        final String[] selectedLanguage = {currentLanguage};

        // 获取所有支持的语言
        String[] languages = LanguageHelper.getSupportedLanguages();

        // 为每种语言创建选项
        for (final String langCode : languages) {
            LinearLayout itemLayout = new LinearLayout(this);
            itemLayout.setOrientation(LinearLayout.HORIZONTAL);
            itemLayout.setGravity(Gravity.CENTER_VERTICAL);
            itemLayout.setPadding(20, 20, 20, 20);
            itemLayout.setBackgroundColor(langCode.equals(currentLanguage) ? 0xFFFFF3E0 : 0xFFF5F5F5);
            LinearLayout.LayoutParams itemParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            );
            itemParams.setMargins(0, 0, 0, (int)(12 * getResources().getDisplayMetrics().density));
            itemLayout.setLayoutParams(itemParams);

            TextView langText = new TextView(this);
            langText.setText(LanguageHelper.getLanguageDisplayName(this, langCode));
            langText.setTextSize(16);
            langText.setTextColor(0xFF000000);
            LinearLayout.LayoutParams textParams = new LinearLayout.LayoutParams(
                0,
                LinearLayout.LayoutParams.WRAP_CONTENT,
                1f
            );
            langText.setLayoutParams(textParams);
            itemLayout.addView(langText);

            TextView checkBox = new TextView(this);
            checkBox.setText(langCode.equals(currentLanguage) ? "✓" : "");
            checkBox.setTextSize(20);
            checkBox.setTextColor(0xFFFF5722);
            checkBox.getPaint().setFakeBoldText(true);
            itemLayout.addView(checkBox);

            itemLayout.setOnClickListener(v -> {
                // 更新选中状态
                selectedLanguage[0] = langCode;

                // 更新所有选项的UI
                for (int i = 0; i < layout.getChildCount(); i++) {
                    View child = layout.getChildAt(i);
                    if (child instanceof LinearLayout && child != layout.getChildAt(0)) {
                        LinearLayout item = (LinearLayout) child;
                        item.setBackgroundColor(0xFFF5F5F5);
                        if (item.getChildCount() >= 2 && item.getChildAt(1) instanceof TextView) {
                            ((TextView) item.getChildAt(1)).setText("");
                        }
                    }
                }

                // 高亮当前选中项
                itemLayout.setBackgroundColor(0xFFFFF3E0);
                checkBox.setText("✓");
            });

            layout.addView(itemLayout);
        }

        // 按钮容器
        LinearLayout buttonContainer = new LinearLayout(this);
        buttonContainer.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams buttonContainerParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        buttonContainerParams.setMargins(0, (int)(20 * getResources().getDisplayMetrics().density), 0, 0);
        buttonContainer.setLayoutParams(buttonContainerParams);

        // 取消按钮
        TextView btnCancel = new TextView(this);
        btnCancel.setText(R.string.btn_cancel);
        btnCancel.setTextSize(16);
        btnCancel.setTextColor(0xFF666666);
        btnCancel.setGravity(Gravity.CENTER);
        btnCancel.setPadding(0, 30, 0, 30);
        btnCancel.setBackgroundColor(0xFFF0F0F0);
        LinearLayout.LayoutParams cancelParams = new LinearLayout.LayoutParams(
            0,
            LinearLayout.LayoutParams.WRAP_CONTENT,
            1f
        );
        cancelParams.setMargins(0, 0, (int)(10 * getResources().getDisplayMetrics().density), 0);
        btnCancel.setLayoutParams(cancelParams);
        btnCancel.setClickable(true);
        btnCancel.setFocusable(true);
        btnCancel.setOnClickListener(v -> dialog.dismiss());
        buttonContainer.addView(btnCancel);

        // 确认按钮
        TextView btnConfirm = new TextView(this);
        btnConfirm.setText(R.string.btn_confirm);
        btnConfirm.setTextSize(16);
        btnConfirm.setTextColor(0xFFFFFFFF);
        btnConfirm.getPaint().setFakeBoldText(true);
        btnConfirm.setGravity(Gravity.CENTER);
        btnConfirm.setPadding(0, 30, 0, 30);
        btnConfirm.setBackgroundColor(0xFF2196F3);
        LinearLayout.LayoutParams confirmParams = new LinearLayout.LayoutParams(
            0,
            LinearLayout.LayoutParams.WRAP_CONTENT,
            1f
        );
        confirmParams.setMargins((int)(10 * getResources().getDisplayMetrics().density), 0, 0, 0);
        btnConfirm.setLayoutParams(confirmParams);
        btnConfirm.setClickable(true);
        btnConfirm.setFocusable(true);
        btnConfirm.setOnClickListener(v -> {
            if (!selectedLanguage[0].equals(currentLanguage)) {
                // 切换语言
                LanguageHelper.changeLanguage(this, selectedLanguage[0]);
                Toast.makeText(this, R.string.language_changed, Toast.LENGTH_SHORT).show();
            }
            dialog.dismiss();
        });
        buttonContainer.addView(btnConfirm);

        layout.addView(buttonContainer);

        dialog.setContentView(layout);
        Window window = dialog.getWindow();
        if (window != null) {
            window.setLayout(
                (int) (getResources().getDisplayMetrics().widthPixels * 0.85),
                LinearLayout.LayoutParams.WRAP_CONTENT
            );
            window.setBackgroundDrawableResource(android.R.color.transparent);
        }

        dialog.show();
    }

    // ==================== 已拆分到独立管理器的方法 ====================
    // WiFi Tab 功能 -> WiFiTabManager.java
    // 发现页面功能 -> DiscoverTabManager.java
    // 我的页面功能 -> ProfileTabManager.java

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (wifiTabManager != null) {
            wifiTabManager.cleanup();
        }
    }
}
