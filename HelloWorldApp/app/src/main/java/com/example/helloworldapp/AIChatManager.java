package com.example.helloworldapp;

import android.app.Activity;
import android.os.Handler;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;

/**
 * AI 聊天管理器
 * 负责处理所有 AI 聊天相关功能，包括：
 * - 专用 AI 助手页面
 * - 首页 AI 聊天（金陵喵）
 * - 聊天消息的显示和处理
 */
public class AIChatManager {
    private Activity activity;

    // 专用 AI 助手页面
    private RelativeLayout aiChatPage;
    private LinearLayout aiChatMessageList;
    private LinearLayout aiChatWelcome;
    private LinearLayout aiChatLoadingIndicator;
    private ScrollView aiChatScrollView;
    private EditText aiChatInput;
    private Button aiChatSendButton;
    private ImageView btnBackFromAiChat;
    private ArrayList<ChatMessage> chatHistory = new ArrayList<>();

    // 首页 AI 聊天（金陵喵）
    private ScrollView homeAiChatHistory;
    private LinearLayout homeAiMessageList;
    private EditText homeAiInput;
    private Button homeAiSendButton;
    private ArrayList<ChatMessage> homeAiChatMessages = new ArrayList<>();

    public AIChatManager(Activity activity) {
        this.activity = activity;
    }

    /**
     * 初始化 AI 聊天相关控件
     */
    public void initialize() {
        // 专用 AI 助手页面
        aiChatPage = activity.findViewById(R.id.aiChatPage);
        aiChatMessageList = activity.findViewById(R.id.aiChatMessageList);
        aiChatWelcome = activity.findViewById(R.id.aiChatWelcome);
        aiChatLoadingIndicator = activity.findViewById(R.id.aiChatLoadingIndicator);
        aiChatScrollView = activity.findViewById(R.id.aiChatScrollView);
        aiChatInput = activity.findViewById(R.id.aiChatInput);
        aiChatSendButton = activity.findViewById(R.id.aiChatSendButton);
        btnBackFromAiChat = activity.findViewById(R.id.btnBackFromAiChat);

        // 首页 AI 聊天
        homeAiChatHistory = activity.findViewById(R.id.homeAiChatHistory);
        homeAiMessageList = activity.findViewById(R.id.homeAiMessageList);
        homeAiInput = activity.findViewById(R.id.homeAiInput);
        homeAiSendButton = activity.findViewById(R.id.homeAiSendButton);

        setupClickListeners();
    }

    /**
     * 设置点击事件
     */
    private void setupClickListeners() {
        // 专用 AI 助手发送按钮
        if (aiChatSendButton != null) {
            aiChatSendButton.setOnClickListener(v -> sendAIChatMessage());
        }

        // 返回按钮
        if (btnBackFromAiChat != null) {
            btnBackFromAiChat.setOnClickListener(v -> hideAIChatPage());
        }

        // 首页 AI 聊天发送按钮
        if (homeAiSendButton != null) {
            homeAiSendButton.setOnClickListener(v -> sendHomeAIChatMessage());
        }
    }

    /**
     * 显示 AI 聊天页面
     */
    public void showAIChatPage() {
        if (aiChatPage != null) {
            aiChatPage.setVisibility(View.VISIBLE);
        }
    }

    /**
     * 隐藏 AI 聊天页面
     */
    public void hideAIChatPage() {
        if (aiChatPage != null) {
            aiChatPage.setVisibility(View.GONE);
        }
    }

    /**
     * 发送 AI 聊天消息（专用页面）
     */
    private void sendAIChatMessage() {
        if (aiChatInput == null || aiChatMessageList == null) return;

        String message = aiChatInput.getText().toString().trim();
        if (message.isEmpty()) {
            Toast.makeText(activity, "请输入消息", Toast.LENGTH_SHORT).show();
            return;
        }

        // 隐藏欢迎界面
        if (aiChatWelcome != null) {
            aiChatWelcome.setVisibility(View.GONE);
        }

        // 添加用户消息
        ChatMessage userMessage = new ChatMessage("user", message, System.currentTimeMillis());
        chatHistory.add(userMessage);
        addMessageToList(aiChatMessageList, userMessage, aiChatScrollView);

        // 清空输入框
        aiChatInput.setText("");

        // 显示加载指示器
        if (aiChatLoadingIndicator != null) {
            aiChatLoadingIndicator.setVisibility(View.VISIBLE);
        }

        // 模拟 AI 回复
        new Handler().postDelayed(() -> {
            // 隐藏加载指示器
            if (aiChatLoadingIndicator != null) {
                aiChatLoadingIndicator.setVisibility(View.GONE);
            }

            // 添加 AI 回复
            String aiReply = generateAIResponse(message);
            ChatMessage aiMessage = new ChatMessage("assistant", aiReply, System.currentTimeMillis());
            chatHistory.add(aiMessage);
            addMessageToList(aiChatMessageList, aiMessage, aiChatScrollView);
        }, 1500);
    }

    /**
     * 发送首页 AI 聊天消息
     */
    private void sendHomeAIChatMessage() {
        if (homeAiInput == null || homeAiMessageList == null) return;

        String message = homeAiInput.getText().toString().trim();
        if (message.isEmpty()) {
            Toast.makeText(activity, "请输入消息", Toast.LENGTH_SHORT).show();
            return;
        }

        // 添加用户消息
        ChatMessage userMessage = new ChatMessage("user", message, System.currentTimeMillis());
        homeAiChatMessages.add(userMessage);
        addMessageToList(homeAiMessageList, userMessage, homeAiChatHistory);

        // 清空输入框
        homeAiInput.setText("");

        // 模拟 AI 回复
        new Handler().postDelayed(() -> {
            String aiReply = generateAIResponse(message);
            ChatMessage aiMessage = new ChatMessage("assistant", aiReply, System.currentTimeMillis());
            homeAiChatMessages.add(aiMessage);
            addMessageToList(homeAiMessageList, aiMessage, homeAiChatHistory);
        }, 1000);
    }

    /**
     * 添加消息到列表
     */
    private void addMessageToList(LinearLayout messageList, ChatMessage message, ScrollView scrollView) {
        View messageView;

        if (message.getRole().equals("user")) {
            // 用户消息
            messageView = LayoutInflater.from(activity).inflate(
                R.layout.item_chat_message_user, messageList, false);
        } else {
            // AI 消息
            messageView = LayoutInflater.from(activity).inflate(
                R.layout.item_chat_message_ai, messageList, false);
        }

        TextView messageText;
        if (message.getRole().equals("user")) {
            messageText = messageView.findViewById(R.id.userMessageText);
        } else {
            messageText = messageView.findViewById(R.id.aiMessageText);
        }
        messageText.setText(message.getContent());

        messageList.addView(messageView);

        // 滚动到底部
        if (scrollView != null) {
            new Handler().postDelayed(() -> {
                scrollView.fullScroll(ScrollView.FOCUS_DOWN);
            }, 100);
        }
    }

    /**
     * 生成 AI 回复（模拟）
     */
    private String generateAIResponse(String userMessage) {
        String message = userMessage.toLowerCase();

        // 公交相关
        if (message.contains("公交") || message.contains("bus")) {
            return "您可以在首页查看实时公交信息，包括到站时间、换乘建议等。需要帮您查询具体线路吗？";
        }

        // WiFi 相关
        if (message.contains("wifi") || message.contains("网络")) {
            return "点击首页的连接WiFi按钮即可连接车载WiFi。如果连接不上，可以尝试关闭WiFi后重新连接。";
        }

        // 附近推荐
        if (message.contains("附近") || message.contains("推荐") || message.contains("美食")) {
            return "首页下方有附近推荐功能，为您推荐附近的美食、玩乐和景点。都是精心挑选的好地方哦！";
        }

        // 厕所等紧急服务
        if (message.contains("厕所") || message.contains("便利店") || message.contains("药店")) {
            return "首页的紧急服务可以帮您快速找到附近的厕所、便利店、药店等设施，还会显示距离和步行时间。";
        }

        // 默认回复
        return "我是您的出行助手！我可以帮您查询公交信息、连接WiFi、推荐附近好去处。有什么需要帮助的吗？";
    }

    /**
     * 获取 AI 聊天页面
     */
    public RelativeLayout getAIChatPage() {
        return aiChatPage;
    }

    /**
     * 获取首页 AI 聊天历史视图
     */
    public ScrollView getHomeAiChatHistory() {
        return homeAiChatHistory;
    }

    /**
     * 清空聊天历史（专用页面）
     */
    public void clearAIChatHistory() {
        chatHistory.clear();
        if (aiChatMessageList != null) {
            aiChatMessageList.removeAllViews();
        }
        if (aiChatWelcome != null) {
            aiChatWelcome.setVisibility(View.VISIBLE);
        }
    }

    /**
     * 清空首页聊天历史
     */
    public void clearHomeAIChatHistory() {
        homeAiChatMessages.clear();
        if (homeAiMessageList != null) {
            homeAiMessageList.removeAllViews();
        }
    }
}
