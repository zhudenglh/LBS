package com.example.helloworldapp;

public class ChatMessage {
    private String role;      // "user" 或 "assistant"
    private String content;   // 消息内容
    private long timestamp;   // 时间戳

    public ChatMessage(String role, String content, long timestamp) {
        this.role = role;
        this.content = content;
        this.timestamp = timestamp;
    }

    public String getRole() {
        return role;
    }

    public String getContent() {
        return content;
    }

    public long getTimestamp() {
        return timestamp;
    }
}
