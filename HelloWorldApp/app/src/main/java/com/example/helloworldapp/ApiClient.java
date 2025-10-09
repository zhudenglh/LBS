package com.example.helloworldapp;

import android.net.Uri;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ApiClient {
    private static final String TAG = "ApiClient";
    // 后端服务器地址（阿里云服务器）
    private static final String BASE_URL = "http://101.37.70.167:3000/api";

    /**
     * 上传图片到后端
     */
    public static void uploadImage(Uri imageUri, android.content.Context context, UploadCallback callback) {
        new Thread(() -> {
            try {
                Log.d(TAG, "开始上传图片: " + imageUri);

                URL url = new URL(BASE_URL + "/upload-image");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();

                String boundary = "----WebKitFormBoundary" + System.currentTimeMillis();

                conn.setDoOutput(true);
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);
                conn.setConnectTimeout(30000); // 30秒连接超时
                conn.setReadTimeout(30000); // 30秒读取超时

                OutputStream outputStream = conn.getOutputStream();
                DataOutputStream dos = new DataOutputStream(outputStream);

                // 写入文件
                dos.writeBytes("--" + boundary + "\r\n");
                dos.writeBytes("Content-Disposition: form-data; name=\"image\"; filename=\"image.jpg\"\r\n");
                dos.writeBytes("Content-Type: image/jpeg\r\n\r\n");

                // 读取图片数据
                java.io.InputStream inputStream = context.getContentResolver().openInputStream(imageUri);
                if (inputStream == null) {
                    throw new Exception("无法读取图片，请检查权限");
                }

                byte[] buffer = new byte[4096];
                int bytesRead;
                long totalBytes = 0;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    dos.write(buffer, 0, bytesRead);
                    totalBytes += bytesRead;
                }
                inputStream.close();

                Log.d(TAG, "图片大小: " + totalBytes + " bytes");

                dos.writeBytes("\r\n");
                dos.writeBytes("--" + boundary + "--\r\n");

                dos.flush();
                dos.close();

                // 读取响应
                int responseCode = conn.getResponseCode();
                Log.d(TAG, "服务器响应码: " + responseCode);

                if (responseCode == HttpURLConnection.HTTP_OK) {
                    BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                    StringBuilder response = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        response.append(line);
                    }
                    reader.close();

                    JSONObject jsonResponse = new JSONObject(response.toString());
                    String imageUrl = jsonResponse.getString("url");

                    Log.d(TAG, "图片上传成功: " + imageUrl);
                    if (callback != null) {
                        callback.onSuccess(imageUrl);
                    }
                } else {
                    // 读取错误信息
                    BufferedReader errorReader = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
                    StringBuilder errorResponse = new StringBuilder();
                    String line;
                    while ((line = errorReader.readLine()) != null) {
                        errorResponse.append(line);
                    }
                    errorReader.close();
                    Log.e(TAG, "服务器错误: " + errorResponse.toString());
                    throw new Exception("上传失败，HTTP状态码: " + responseCode + ", 错误: " + errorResponse.toString());
                }

                conn.disconnect();

            } catch (Exception e) {
                Log.e(TAG, "图片上传失败: " + e.getMessage());
                e.printStackTrace();
                if (callback != null) {
                    callback.onFailure(e.getMessage());
                }
            }
        }).start();
    }

    /**
     * 创建帖子
     */
    public static void createPost(String title, String content, String busTag, List<String> imageUrls, CreatePostCallback callback) {
        new Thread(() -> {
            try {
                URL url = new URL(BASE_URL + "/posts");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();

                conn.setDoOutput(true);
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");

                // 构建 JSON 请求体
                JSONObject jsonBody = new JSONObject();
                jsonBody.put("title", title);
                jsonBody.put("content", content);
                jsonBody.put("busTag", busTag);

                if (imageUrls != null && !imageUrls.isEmpty()) {
                    JSONArray imagesArray = new JSONArray();
                    for (String imageUrl : imageUrls) {
                        imagesArray.put(imageUrl);
                    }
                    jsonBody.put("imageUrls", imagesArray);
                }

                // 发送请求
                OutputStream os = conn.getOutputStream();
                os.write(jsonBody.toString().getBytes("UTF-8"));
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
                    String postId = jsonResponse.getString("postId");

                    Log.d(TAG, "帖子创建成功: " + postId);
                    if (callback != null) {
                        callback.onSuccess(postId);
                    }
                } else {
                    // 读取错误信息
                    BufferedReader errorReader = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
                    StringBuilder errorResponse = new StringBuilder();
                    String line;
                    while ((line = errorReader.readLine()) != null) {
                        errorResponse.append(line);
                    }
                    errorReader.close();
                    String errorMsg = errorResponse.toString();
                    Log.e(TAG, "服务器错误 " + responseCode + ": " + errorMsg);
                    throw new Exception("创建帖子失败 (HTTP " + responseCode + "): " + errorMsg);
                }

                conn.disconnect();

            } catch (Exception e) {
                Log.e(TAG, "创建帖子失败: " + e.getMessage());
                e.printStackTrace();
                if (callback != null) {
                    callback.onFailure(e.getMessage());
                }
            }
        }).start();
    }

    /**
     * 获取帖子列表
     */
    public static void getPosts(GetPostsCallback callback) {
        new Thread(() -> {
            try {
                URL url = new URL(BASE_URL + "/posts");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();

                conn.setRequestMethod("GET");

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
                    JSONArray postsArray = jsonResponse.getJSONArray("posts");

                    List<Map<String, Object>> posts = new ArrayList<>();
                    for (int i = 0; i < postsArray.length(); i++) {
                        JSONObject postJson = postsArray.getJSONObject(i);
                        Map<String, Object> post = new HashMap<>();

                        post.put("post_id", postJson.getString("post_id"));
                        post.put("title", postJson.optString("title", ""));
                        post.put("content", postJson.optString("content", ""));
                        post.put("username", postJson.optString("username", ""));
                        post.put("avatar", postJson.optString("avatar", ""));
                        post.put("timestamp", postJson.optLong("timestamp", 0));
                        post.put("bus_tag", postJson.optString("bus_tag", ""));
                        post.put("likes", postJson.optLong("likes", 0));
                        post.put("comments", postJson.optLong("comments", 0));
                        post.put("image_urls", postJson.optString("image_urls", ""));

                        posts.add(post);
                    }

                    Log.d(TAG, "获取到 " + posts.size() + " 条帖子");
                    if (callback != null) {
                        callback.onSuccess(posts);
                    }
                } else {
                    throw new Exception("获取帖子失败，HTTP状态码: " + responseCode);
                }

                conn.disconnect();

            } catch (Exception e) {
                Log.e(TAG, "获取帖子失败: " + e.getMessage());
                e.printStackTrace();
                if (callback != null) {
                    callback.onFailure(e.getMessage());
                }
            }
        }).start();
    }

    public interface UploadCallback {
        void onSuccess(String imageUrl);
        void onFailure(String error);
    }

    public interface CreatePostCallback {
        void onSuccess(String postId);
        void onFailure(String error);
    }

    public interface GetPostsCallback {
        void onSuccess(List<Map<String, Object>> posts);
        void onFailure(String error);
    }
}
