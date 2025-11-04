package com.example.helloworldapp;

import android.app.Activity;
import android.app.Dialog;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

/**
 * 对话框管理器
 * 负责管理应用中的所有对话框，包括：
 * - WiFi 连接对话框
 * - 换乘详情对话框
 * - 优惠券对话框
 * - 欢迎对话框
 * - Toast 提示
 */
public class DialogManager {
    private Activity activity;
    private Toast customToast;
    private UserManager userManager;

    public DialogManager(Activity activity, UserManager userManager) {
        this.activity = activity;
        this.userManager = userManager;
    }

    /**
     * 显示连接中的 Toast
     */
    public void showConnectingToast() {
        View toastView = LayoutInflater.from(activity).inflate(R.layout.custom_toast, null);
        TextView toastText = toastView.findViewById(R.id.toastText);
        toastText.setText(activity.getString(R.string.connecting_wifi_loading));

        customToast = new Toast(activity);
        customToast.setView(toastView);
        customToast.setDuration(Toast.LENGTH_SHORT);
        customToast.setGravity(Gravity.CENTER, 0, 0);
        customToast.show();
    }

    /**
     * 取消当前 Toast
     */
    public void cancelToast() {
        if (customToast != null) {
            customToast.cancel();
        }
    }

    /**
     * 显示优惠券对话框
     */
    public void showCouponsDialog() {
        Dialog dialog = new Dialog(activity);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.dialog_coupons);

        // 设置对话框样式
        Window window = dialog.getWindow();
        if (window != null) {
            window.setLayout(
                (int) (activity.getResources().getDisplayMetrics().widthPixels * 0.85),
                LinearLayout.LayoutParams.WRAP_CONTENT
            );
            window.setBackgroundDrawableResource(android.R.color.transparent);
        }

        // 关闭按钮
        TextView btnClose = dialog.findViewById(R.id.closeDialog);
        if (btnClose != null) {
            btnClose.setOnClickListener(v -> dialog.dismiss());
        }

        dialog.show();
    }

    /**
     * 显示 WiFi 状态对话框
     */
    public void showWifiStatusDialog() {
        Dialog dialog = new Dialog(activity);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.dialog_wifi_status);

        Window window = dialog.getWindow();
        if (window != null) {
            window.setLayout(
                (int) (activity.getResources().getDisplayMetrics().widthPixels * 0.85),
                LinearLayout.LayoutParams.WRAP_CONTENT
            );
            window.setBackgroundDrawableResource(android.R.color.transparent);
        }

        // 关闭按钮
        Button btnClose = dialog.findViewById(R.id.cancelButton);
        if (btnClose != null) {
            btnClose.setOnClickListener(v -> dialog.dismiss());
        }

        dialog.show();
    }

    /**
     * 显示换乘详情对话框
     */
    public void showTransferDetailDialog(boolean scrollToBus) {
        Dialog dialog = new Dialog(activity);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.dialog_transfer_detail);

        Window window = dialog.getWindow();
        if (window != null) {
            window.setLayout(
                (int) (activity.getResources().getDisplayMetrics().widthPixels * 0.9),
                LinearLayout.LayoutParams.WRAP_CONTENT
            );
            window.setBackgroundDrawableResource(android.R.color.transparent);
        }

        // 关闭按钮
        TextView btnClose = dialog.findViewById(R.id.closeTransferDialog);
        if (btnClose != null) {
            btnClose.setOnClickListener(v -> dialog.dismiss());
        }

        dialog.show();
    }

    /**
     * 显示WiFi连接对话框
     */
    public void showWifiDialog() {
        Dialog dialog = new Dialog(activity);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.dialog_wifi_connect);

        Window window = dialog.getWindow();
        if (window != null) {
            window.setLayout(
                (int) (activity.getResources().getDisplayMetrics().widthPixels * 0.9),
                LinearLayout.LayoutParams.WRAP_CONTENT
            );
            window.setBackgroundDrawableResource(android.R.color.transparent);
        }

        // 设置点击事件
        TextView btnConnect = dialog.findViewById(R.id.btnWifiConnect);
        if (btnConnect != null) {
            btnConnect.setOnClickListener(v -> {
                dialog.dismiss();
                showConnectingToast();
            });
        }

        TextView btnClose = dialog.findViewById(R.id.btnWifiCancel);
        if (btnClose != null) {
            btnClose.setOnClickListener(v -> dialog.dismiss());
        }

        dialog.show();
    }

    /**
     * 显示欢迎对话框（新用户）
     */
    public void showWelcomeDialog() {
        Dialog dialog = new Dialog(activity);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setCancelable(false);

        LinearLayout layout = new LinearLayout(activity);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(48, 48, 48, 48);
        layout.setBackgroundColor(0xFFFFFFFF);

        // 标题
        TextView title = new TextView(activity);
        title.setText(activity.getString(R.string.welcome_title));
        title.setTextSize(20);
        title.setTextColor(0xFF000000);
        title.setGravity(Gravity.CENTER);
        title.setPadding(0, 0, 0, 24);
        layout.addView(title);

        // 提示文字
        TextView hint = new TextView(activity);
        hint.setText(activity.getString(R.string.welcome_setup_hint));
        hint.setTextSize(14);
        hint.setTextColor(0xFF666666);
        hint.setGravity(Gravity.CENTER);
        hint.setPadding(0, 0, 0, 24);
        layout.addView(hint);

        // 头像选择（简化版）
        TextView avatarHint = new TextView(activity);
        avatarHint.setText(activity.getString(R.string.select_avatar));
        avatarHint.setTextSize(14);
        avatarHint.setTextColor(0xFF333333);
        avatarHint.setPadding(0, 0, 0, 12);
        layout.addView(avatarHint);

        // 头像选项
        LinearLayout avatarContainer = new LinearLayout(activity);
        avatarContainer.setOrientation(LinearLayout.HORIZONTAL);
        avatarContainer.setGravity(Gravity.CENTER);
        String[] avatars = {"👨", "👩", "🧑", "👴", "👵"};
        final String[] selectedAvatar = {avatars[0]};

        for (String avatar : avatars) {
            TextView avatarView = new TextView(activity);
            avatarView.setText(avatar);
            avatarView.setTextSize(32);
            avatarView.setPadding(12, 12, 12, 12);
            avatarView.setOnClickListener(v -> {
                selectedAvatar[0] = avatar;
                // 可以添加选中效果
            });
            avatarContainer.addView(avatarView);
        }
        layout.addView(avatarContainer);

        // 昵称输入
        TextView nicknameHint = new TextView(activity);
        nicknameHint.setText(activity.getString(R.string.nickname) + "：");
        nicknameHint.setTextSize(14);
        nicknameHint.setTextColor(0xFF333333);
        nicknameHint.setPadding(0, 24, 0, 12);
        layout.addView(nicknameHint);

        EditText nicknameInput = new EditText(activity);
        nicknameInput.setHint("请输入昵称（2-10个字符）");
        nicknameInput.setPadding(16, 16, 16, 16);
        nicknameInput.setBackgroundResource(android.R.drawable.edit_text);
        layout.addView(nicknameInput);

        // 确认按钮
        Button confirmBtn = new Button(activity);
        confirmBtn.setText(activity.getString(R.string.start_using));
        confirmBtn.setTextColor(0xFFFFFFFF);
        confirmBtn.setBackgroundColor(0xFFFFD700);
        LinearLayout.LayoutParams btnParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        btnParams.setMargins(0, 32, 0, 0);
        confirmBtn.setLayoutParams(btnParams);

        confirmBtn.setOnClickListener(v -> {
            String nickname = nicknameInput.getText().toString().trim();
            if (nickname.isEmpty()) {
                Toast.makeText(activity, activity.getString(R.string.please_enter_nickname), Toast.LENGTH_SHORT).show();
                return;
            }
            if (nickname.length() < 2 || nickname.length() > 10) {
                Toast.makeText(activity, activity.getString(R.string.nickname_length_error), Toast.LENGTH_SHORT).show();
                return;
            }

            // 保存用户信息
            userManager.saveUserInfo(nickname, selectedAvatar[0]);
            Toast.makeText(activity, "欢迎，" + nickname + "！", Toast.LENGTH_SHORT).show();
            dialog.dismiss();
        });
        layout.addView(confirmBtn);

        dialog.setContentView(layout);
        dialog.show();

        Window window = dialog.getWindow();
        if (window != null) {
            window.setLayout(
                (int) (activity.getResources().getDisplayMetrics().widthPixels * 0.85),
                LinearLayout.LayoutParams.WRAP_CONTENT
            );
            window.setBackgroundDrawableResource(android.R.color.transparent);
        }
    }

    /**
     * 显示成功对话框
     */
    public void showSuccessDialog(String message) {
        Dialog dialog = new Dialog(activity);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.dialog_success);

        // dialog_success.xml 的消息是固定的，不需要动态设置

        Window window = dialog.getWindow();
        if (window != null) {
            window.setLayout(
                (int) (activity.getResources().getDisplayMetrics().widthPixels * 0.7),
                LinearLayout.LayoutParams.WRAP_CONTENT
            );
            window.setBackgroundDrawableResource(android.R.color.transparent);
        }

        dialog.show();

        // 2秒后自动关闭
        new android.os.Handler().postDelayed(dialog::dismiss, 2000);
    }

    /**
     * 显示加载对话框
     */
    public Dialog showLoadingDialog(String message) {
        Dialog dialog = new Dialog(activity);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.dialog_loading);
        dialog.setCancelable(false);

        TextView messageText = dialog.findViewById(R.id.loadingText);
        if (messageText != null) {
            messageText.setText(message);
        }

        Window window = dialog.getWindow();
        if (window != null) {
            window.setLayout(
                (int) (activity.getResources().getDisplayMetrics().widthPixels * 0.6),
                LinearLayout.LayoutParams.WRAP_CONTENT
            );
            window.setBackgroundDrawableResource(android.R.color.transparent);
        }

        dialog.show();
        return dialog;
    }
}
