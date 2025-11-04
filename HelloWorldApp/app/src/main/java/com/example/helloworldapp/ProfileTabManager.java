package com.example.helloworldapp;

import android.app.Activity;
import android.app.Dialog;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Handler;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * 我的页面管理器
 * 负责处理我的 Tab 的所有功能，包括：
 * - 用户信息展示
 * - 我的发布
 * - 我的收藏
 * - 语言设置
 */
public class ProfileTabManager {
    private Activity activity;
    private ApiClient apiClient;
    private UserManager userManager;

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

    public ProfileTabManager(Activity activity, ApiClient apiClient, UserManager userManager) {
        this.activity = activity;
        this.apiClient = apiClient;
        this.userManager = userManager;
    }

    /**
     * 初始化我的页面的所有控件
     */
    public void initialize() {
        profilePage = activity.findViewById(R.id.profilePage);
        profileAvatar = activity.findViewById(R.id.profileAvatar);
        profileNickname = activity.findViewById(R.id.profileNickname);
        profileUserId = activity.findViewById(R.id.profileUserId);
        profilePostCount = activity.findViewById(R.id.profilePostCount);
        profileLikeCount = activity.findViewById(R.id.profileLikeCount);
        profileCollectCount = activity.findViewById(R.id.profileCollectCount);
        btnEditProfile = activity.findViewById(R.id.btnEditProfile);
        btnMyPosts = activity.findViewById(R.id.btnMyPosts);
        btnMyCollects = activity.findViewById(R.id.btnMyCollects);
        // 语言设置按钮保留在 MainActivity 中处理

        // 我的发布页面
        myPostsPage = activity.findViewById(R.id.myPostsPage);
        myPostsList = activity.findViewById(R.id.myPostsList);
        myPostsEmptyState = activity.findViewById(R.id.myPostsEmptyState);
        myPostsSwipeRefresh = activity.findViewById(R.id.myPostsSwipeRefresh);
        btnBackFromMyPosts = activity.findViewById(R.id.btnBackFromMyPosts);

        setupClickListeners();
    }

    /**
     * 显示我的页面
     */
    public void show() {
        if (profilePage != null) {
            profilePage.setVisibility(View.VISIBLE);
            updateProfilePage();
        }
    }

    /**
     * 隐藏我的页面
     */
    public void hide() {
        if (profilePage != null) {
            profilePage.setVisibility(View.GONE);
        }
    }

    /**
     * 显示我的发布页面
     */
    public void showMyPostsPage() {
        if (myPostsPage != null) {
            myPostsPage.setVisibility(View.VISIBLE);
            loadMyPosts();
        }
    }

    /**
     * 隐藏我的发布页面
     */
    public void hideMyPostsPage() {
        if (myPostsPage != null) {
            myPostsPage.setVisibility(View.GONE);
        }
    }

    /**
     * 设置按钮点击事件
     */
    private void setupClickListeners() {
        // 编辑资料
        if (btnEditProfile != null) {
            btnEditProfile.setOnClickListener(v -> showEditProfileDialog());
        }

        // 我的发布
        if (btnMyPosts != null) {
            btnMyPosts.setOnClickListener(v -> showMyPostsPage());
        }

        // 我的收藏
        if (btnMyCollects != null) {
            btnMyCollects.setOnClickListener(v -> {
                Toast.makeText(activity, "我的收藏功能开发中", Toast.LENGTH_SHORT).show();
            });
        }

        // 语言设置保留在 MainActivity 中处理

        // 返回按钮（从我的发布页面返回）
        if (btnBackFromMyPosts != null) {
            btnBackFromMyPosts.setOnClickListener(v -> {
                hideMyPostsPage();
                show();
            });
        }

        // 下拉刷新我的发布
        if (myPostsSwipeRefresh != null) {
            myPostsSwipeRefresh.setOnRefreshListener(() -> {
                loadMyPosts();
                new Handler().postDelayed(() -> {
                    myPostsSwipeRefresh.setRefreshing(false);
                }, 1000);
            });
        }
    }

    /**
     * 更新我的页面数据
     */
    public void updateProfilePage() {
        if (userManager == null || !userManager.hasUserInfo()) {
            return;
        }

        // 更新用户信息
        if (profileAvatar != null) {
            profileAvatar.setText(userManager.getAvatar());
        }
        if (profileNickname != null) {
            profileNickname.setText(userManager.getNickname());
        }
        if (profileUserId != null) {
            profileUserId.setText("ID: " + userManager.getUserId());
        }

        // 更新统计数据（从服务器获取）
        loadUserStats();
    }

    /**
     * 加载用户统计数据
     */
    private void loadUserStats() {
        new Thread(() -> {
            try {
                // 这里可以调用 API 获取用户统计数据
                // 暂时使用模拟数据
                activity.runOnUiThread(() -> {
                    if (profilePostCount != null) {
                        profilePostCount.setText("0");
                    }
                    if (profileLikeCount != null) {
                        profileLikeCount.setText("0");
                    }
                    if (profileCollectCount != null) {
                        profileCollectCount.setText("0");
                    }
                });
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    /**
     * 加载我的发布列表
     */
    private void loadMyPosts() {
        if (myPostsList == null) return;

        String currentUserId = userManager.getUserId();
        ApiClient.getPosts(currentUserId, new ApiClient.GetPostsCallback() {
            @Override
            public void onSuccess(java.util.List<java.util.Map<String, Object>> posts) {
                activity.runOnUiThread(() -> {
                    myPostsList.removeAllViews();

                    if (posts.isEmpty()) {
                        // 显示空状态
                        if (myPostsEmptyState != null) {
                            myPostsEmptyState.setVisibility(View.VISIBLE);
                        }
                    } else {
                        if (myPostsEmptyState != null) {
                            myPostsEmptyState.setVisibility(View.GONE);
                        }

                        for (java.util.Map<String, Object> postData : posts) {
                            addPostToMyList(postData);
                        }
                    }

                    // 更新发布数量
                    if (profilePostCount != null) {
                        profilePostCount.setText(String.valueOf(posts.size()));
                    }
                });
            }

            @Override
            public void onFailure(String error) {
                activity.runOnUiThread(() ->
                    Toast.makeText(activity, "加载失败: " + error, Toast.LENGTH_SHORT).show()
                );
            }
        });
    }

    /**
     * 添加帖子到我的发布列表
     */
    private void addPostToMyList(java.util.Map<String, Object> postData) {
        try {
            View postView = LayoutInflater.from(activity).inflate(R.layout.item_community_post, myPostsList, false);

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
            username.setText((String) postData.getOrDefault("username", "匿名用户"));

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

            myPostsList.addView(postView);
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
            return "刚刚";
        } else if (diff < 3600000) {
            return (diff / 60000) + "分钟前";
        } else if (diff < 86400000) {
            return (diff / 3600000) + "小时前";
        } else {
            return (diff / 86400000) + "天前";
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
     * 显示编辑资料对话框
     */
    private void showEditProfileDialog() {
        Toast.makeText(activity, "编辑资料功能开发中", Toast.LENGTH_SHORT).show();
    }

    /**
     * 显示语言设置对话框
     */
    private void showLanguageDialog() {
        Dialog dialog = new Dialog(activity);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);

        LinearLayout layout = new LinearLayout(activity);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(48, 48, 48, 48);

        TextView title = new TextView(activity);
        title.setText("选择语言 / Pilih Bahasa");
        title.setTextSize(18);
        title.setTextColor(0xFF000000);
        layout.addView(title);

        // 中文选项
        TextView chinese = new TextView(activity);
        chinese.setText("🇨🇳 中文");
        chinese.setTextSize(16);
        chinese.setPadding(0, 24, 0, 24);
        chinese.setOnClickListener(v -> {
            LanguageHelper.changeLanguage(activity, "zh");
            Toast.makeText(activity, "语言已切换为中文", Toast.LENGTH_SHORT).show();
            dialog.dismiss();
        });
        layout.addView(chinese);

        // 印尼语选项
        TextView indonesian = new TextView(activity);
        indonesian.setText("🇮🇩 Bahasa Indonesia");
        indonesian.setTextSize(16);
        indonesian.setPadding(0, 24, 0, 24);
        indonesian.setOnClickListener(v -> {
            LanguageHelper.changeLanguage(activity, "in");
            Toast.makeText(activity, "Bahasa telah diubah ke Indonesia", Toast.LENGTH_SHORT).show();
            dialog.dismiss();
        });
        layout.addView(indonesian);

        // 英语选项
        TextView english = new TextView(activity);
        english.setText("🇬🇧 English");
        english.setTextSize(16);
        english.setPadding(0, 24, 0, 24);
        english.setOnClickListener(v -> {
            LanguageHelper.changeLanguage(activity, "en");
            Toast.makeText(activity, "Language changed to English", Toast.LENGTH_SHORT).show();
            dialog.dismiss();
        });
        layout.addView(english);

        dialog.setContentView(layout);
        dialog.show();

        Window window = dialog.getWindow();
        if (window != null) {
            window.setLayout(
                (int) (activity.getResources().getDisplayMetrics().widthPixels * 0.8),
                LinearLayout.LayoutParams.WRAP_CONTENT
            );
            window.setBackgroundDrawableResource(android.R.color.transparent);
        }
    }
}
