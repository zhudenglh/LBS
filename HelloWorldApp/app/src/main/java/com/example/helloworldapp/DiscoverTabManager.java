package com.example.helloworldapp;

import android.app.Activity;
import android.app.Dialog;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Handler;
import android.provider.MediaStore;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;

/**
 * 发现页面管理器
 * 负责处理发现 Tab 的所有功能，包括：
 * - 帖子列表展示
 * - 发布新帖子
 * - 附近的人功能
 * - 帖子交互（点赞、评论）
 */
public class DiscoverTabManager {
    private Activity activity;
    private ApiClient apiClient;
    private UserManager userManager;

    private RelativeLayout discoverPage;
    private LinearLayout discoverPostList;
    private TextView btnPublish;
    private androidx.swiperefreshlayout.widget.SwipeRefreshLayout swipeRefreshLayout;
    private TextView tabLookAround;
    private TextView tabNearbyPeople;
    private ScrollView nearbyPeopleContainer;
    private LinearLayout nearbyPeopleList;

    // 发布对话框相关
    private Dialog currentPublishDialog;
    private LinearLayout currentImagePreviewContainer;
    private ArrayList<Uri> selectedImages = new ArrayList<>();
    private android.widget.EditText currentEtTitle;
    private android.widget.EditText currentEtContent;
    private ArrayList<String> currentSelectedBusList;

    // 图片选择请求码
    public static final int PICK_IMAGE_REQUEST = 1001;

    public DiscoverTabManager(Activity activity, ApiClient apiClient, UserManager userManager) {
        this.activity = activity;
        this.apiClient = apiClient;
        this.userManager = userManager;
    }

    /**
     * 初始化发现页面的所有控件
     */
    public void initialize() {
        discoverPage = activity.findViewById(R.id.discoverPage);
        discoverPostList = activity.findViewById(R.id.discoverPostList);
        btnPublish = activity.findViewById(R.id.btnPublish);
        swipeRefreshLayout = activity.findViewById(R.id.swipeRefreshLayout);
        tabLookAround = activity.findViewById(R.id.tabLookAround);
        tabNearbyPeople = activity.findViewById(R.id.tabNearbyPeople);
        nearbyPeopleContainer = activity.findViewById(R.id.nearbyPeopleContainer);
        nearbyPeopleList = activity.findViewById(R.id.nearbyPeopleList);

        setupClickListeners();
        setupTabSwitching();
    }

    /**
     * 显示发现页面
     */
    public void show() {
        if (discoverPage != null) {
            discoverPage.setVisibility(View.VISIBLE);
            loadDiscoverPosts();
        }
    }

    /**
     * 隐藏发现页面
     */
    public void hide() {
        if (discoverPage != null) {
            discoverPage.setVisibility(View.GONE);
        }
    }

    /**
     * 检查是否需要显示欢迎对话框
     */
    public boolean checkAndShowWelcomeIfNeeded(Runnable onWelcomeComplete) {
        if (!userManager.hasUserInfo()) {
            // 需要显示欢迎对话框
            return true;
        }
        return false;
    }

    /**
     * 设置按钮点击事件
     */
    private void setupClickListeners() {
        // 发布按钮
        if (btnPublish != null) {
            btnPublish.setOnClickListener(v -> showPublishDialog());
        }

        // 下拉刷新
        if (swipeRefreshLayout != null) {
            swipeRefreshLayout.setOnRefreshListener(() -> {
                loadDiscoverPosts();
                new Handler().postDelayed(() -> {
                    swipeRefreshLayout.setRefreshing(false);
                }, 1000);
            });
        }
    }

    /**
     * 设置 Tab 切换
     */
    private void setupTabSwitching() {
        if (tabLookAround != null) {
            tabLookAround.getPaint().setFakeBoldText(true);
            tabLookAround.getPaint().setUnderlineText(true);

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

                // 显示逛逛内容，隐藏附近的人
                if (swipeRefreshLayout != null) {
                    swipeRefreshLayout.setVisibility(View.VISIBLE);
                }
                if (nearbyPeopleContainer != null) {
                    nearbyPeopleContainer.setVisibility(View.GONE);
                }
            });
        }

        if (tabNearbyPeople != null) {
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

                // 显示附近的人，隐藏逛逛内容
                if (nearbyPeopleContainer != null) {
                    nearbyPeopleContainer.setVisibility(View.VISIBLE);
                }
                if (swipeRefreshLayout != null) {
                    swipeRefreshLayout.setVisibility(View.GONE);
                }

                // 加载附近的人数据
                loadNearbyPeople();
            });
        }
    }

    /**
     * 加载发现页面的帖子列表
     */
    public void loadDiscoverPosts() {
        if (discoverPostList == null) return;

        String currentUserId = userManager.getUserId();
        ApiClient.getPosts(currentUserId, new ApiClient.GetPostsCallback() {
            @Override
            public void onSuccess(java.util.List<java.util.Map<String, Object>> posts) {
                activity.runOnUiThread(() -> {
                    discoverPostList.removeAllViews();

                    for (java.util.Map<String, Object> postData : posts) {
                        addPostToDiscoverList(postData);
                    }
                });
            }

            @Override
            public void onFailure(String error) {
                activity.runOnUiThread(() ->
                    Toast.makeText(activity, activity.getString(R.string.load_posts_failed, error), Toast.LENGTH_SHORT).show()
                );
            }
        });
    }

    /**
     * 添加帖子到发现列表
     */
    private void addPostToDiscoverList(java.util.Map<String, Object> postData) {
        try {
            View postView = LayoutInflater.from(activity).inflate(R.layout.item_community_post, discoverPostList, false);

            TextView avatar = postView.findViewById(R.id.postAvatar);
            TextView username = postView.findViewById(R.id.postUsername);
            TextView time = postView.findViewById(R.id.postTime);
            TextView content = postView.findViewById(R.id.postContent);
            TextView busTag = postView.findViewById(R.id.postBusTag);
            LinearLayout imageContainer = postView.findViewById(R.id.postImageContainer);
            TextView likeBtn = postView.findViewById(R.id.postLikeBtn);
            TextView commentBtn = postView.findViewById(R.id.postCommentBtn);

            // 设置帖子数据
            avatar.setText((String) postData.getOrDefault("avatar", "👤"));
            username.setText((String) postData.getOrDefault("username", activity.getString(R.string.anonymous_user)));

            long timestamp = (Long) postData.getOrDefault("timestamp", 0L);
            time.setText(formatTimeAgo(timestamp));

            content.setText((String) postData.getOrDefault("content", ""));

            String tag = (String) postData.getOrDefault("bus_tag", "");
            if (!tag.isEmpty()) {
                busTag.setVisibility(View.VISIBLE);
                busTag.setText(tag);
            } else {
                busTag.setVisibility(View.GONE);
            }

            likeBtn.setText("👍 " + String.valueOf(postData.getOrDefault("likes", 0L)));
            commentBtn.setText("💬 " + String.valueOf(postData.getOrDefault("comments", 0L)));

            // 加载图片
            String imageUrls = (String) postData.getOrDefault("image_urls", "");
            if (!imageUrls.isEmpty()) {
                loadPostImages(imageContainer, imageUrls);
            }

            discoverPostList.addView(postView);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 格式化时间显示
     */
    private String formatTimeAgo(long timestamp) {
        long now = System.currentTimeMillis();
        long diff = now - timestamp;

        if (diff < 60000) {
            return activity.getString(R.string.time_just_now);
        } else if (diff < 3600000) {
            return activity.getString(R.string.time_minutes_ago, (int)(diff / 60000));
        } else if (diff < 86400000) {
            return activity.getString(R.string.time_hours_ago, (int)(diff / 3600000));
        } else {
            return activity.getString(R.string.time_days_ago, (int)(diff / 86400000));
        }
    }

    /**
     * 加载帖子图片
     */
    private void loadPostImages(LinearLayout imageContainer, String imageUrls) {
        String[] urls = imageUrls.split(",");
        imageContainer.removeAllViews();

        for (String url : urls) {
            if (url.trim().isEmpty()) continue;

            ImageView imageView = new ImageView(activity);
            int imageSize = (int) (activity.getResources().getDisplayMetrics().density * 100);
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(imageSize, imageSize);
            params.setMargins(0, 0, 12, 0);
            imageView.setLayoutParams(params);
            imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);

            // 在后台加载图片
            new Thread(() -> {
                try {
                    URL imageUrl = new URL(url.trim());
                    HttpURLConnection connection = (HttpURLConnection) imageUrl.openConnection();
                    connection.setDoInput(true);
                    connection.connect();
                    InputStream input = connection.getInputStream();
                    Bitmap bitmap = BitmapFactory.decodeStream(input);

                    activity.runOnUiThread(() -> {
                        if (bitmap != null) {
                            imageView.setImageBitmap(bitmap);
                        }
                    });
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }).start();

            imageContainer.addView(imageView);
        }
    }

    /**
     * 显示发布对话框
     */
    private void showPublishDialog() {
        Dialog dialog = new Dialog(activity);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.dialog_publish_post);

        // 初始化发布对话框的控件并保存引用
        currentPublishDialog = dialog;
        // 这里可以添加更多的发布对话框逻辑

        dialog.show();

        Window window = dialog.getWindow();
        if (window != null) {
            window.setLayout(
                (int) (activity.getResources().getDisplayMetrics().widthPixels * 0.9),
                LinearLayout.LayoutParams.WRAP_CONTENT
            );
            window.setBackgroundDrawableResource(android.R.color.transparent);
        }
    }

    /**
     * 加载附近的人
     */
    private void loadNearbyPeople() {
        if (nearbyPeopleList == null) return;

        nearbyPeopleList.removeAllViews();

        // 模拟数据
        String[] users = {
            activity.getString(R.string.sample_user_1),
            activity.getString(R.string.sample_user_2),
            activity.getString(R.string.sample_user_3),
            activity.getString(R.string.sample_user_4),
            activity.getString(R.string.sample_user_5)
        };
        String[] distances = {"50m", "120m", "200m", "350m", "500m"};

        for (int i = 0; i < users.length; i++) {
            View userView = LayoutInflater.from(activity).inflate(R.layout.item_community_post, nearbyPeopleList, false);

            TextView avatar = userView.findViewById(R.id.postAvatar);
            TextView username = userView.findViewById(R.id.postUsername);
            TextView time = userView.findViewById(R.id.postTime);
            TextView content = userView.findViewById(R.id.postContent);

            avatar.setText("👤");
            username.setText(users[i]);
            time.setText(distances[i]);
            content.setText(activity.getString(R.string.in_nearby));

            nearbyPeopleList.addView(userView);
        }
    }

    /**
     * 处理图片选择结果
     */
    public void handleImageSelectionResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == PICK_IMAGE_REQUEST && resultCode == Activity.RESULT_OK) {
            if (data != null && currentImagePreviewContainer != null) {
                Uri imageUri = data.getData();
                if (imageUri != null) {
                    selectedImages.add(imageUri);
                    // 添加图片预览逻辑
                }
            }
        }
    }

    /**
     * 获取当前发布对话框
     */
    public Dialog getCurrentPublishDialog() {
        return currentPublishDialog;
    }
}
