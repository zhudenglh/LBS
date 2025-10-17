#!/bin/bash

# 验证后端部署是否正确的脚本

echo "========================================="
echo "验证出行宝后端部署"
echo "========================================="
echo ""

SERVER_URL="http://101.37.70.167:3000"
TEST_USER_ID="test_verify_123"

echo "步骤 1: 检查健康状态"
curl -s "$SERVER_URL/health"
echo ""
echo ""

echo "步骤 2: 获取帖子列表（不带userId）"
echo "请求: GET $SERVER_URL/api/posts"
RESPONSE_NO_USER=$(curl -s "$SERVER_URL/api/posts")
echo "$RESPONSE_NO_USER" | jq '.posts[0] | {post_id, likes, isLikedByUser}' 2>/dev/null || echo "$RESPONSE_NO_USER"
echo ""
echo ""

echo "步骤 3: 获取帖子列表（带userId）- 关键检查点！"
echo "请求: GET $SERVER_URL/api/posts?userId=$TEST_USER_ID"
RESPONSE_WITH_USER=$(curl -s "$SERVER_URL/api/posts?userId=$TEST_USER_ID")
echo "$RESPONSE_WITH_USER" | jq '.posts[0] | {post_id, likes, isLikedByUser}' 2>/dev/null || echo "$RESPONSE_WITH_USER"
echo ""

# 检查是否有isLikedByUser字段
HAS_FIELD=$(echo "$RESPONSE_WITH_USER" | grep -o "isLikedByUser" | head -1)
if [ -n "$HAS_FIELD" ]; then
    echo "✅ 后端返回了 isLikedByUser 字段"
else
    echo "❌ 后端没有返回 isLikedByUser 字段 - 代码可能没有正确部署！"
fi
echo ""

# 检查isLikedByUser的值
IS_LIKED=$(echo "$RESPONSE_WITH_USER" | jq -r '.posts[0].isLikedByUser' 2>/dev/null)
echo "isLikedByUser 的值: $IS_LIKED"
if [ "$IS_LIKED" = "true" ]; then
    echo "⚠️  警告：isLikedByUser 是 true，但 likes 表是空的！这不正常！"
elif [ "$IS_LIKED" = "false" ]; then
    echo "✅ isLikedByUser 是 false，这是正确的（因为 likes 表是空的）"
else
    echo "❌ isLikedByUser 的值异常: $IS_LIKED"
fi
echo ""
echo ""

echo "步骤 4: 测试点赞 API"
FIRST_POST_ID=$(echo "$RESPONSE_WITH_USER" | jq -r '.posts[0].post_id' 2>/dev/null)
if [ -z "$FIRST_POST_ID" ] || [ "$FIRST_POST_ID" = "null" ]; then
    echo "❌ 无法获取帖子ID，跳过点赞测试"
else
    echo "使用帖子ID: $FIRST_POST_ID"
    echo "请求: POST $SERVER_URL/api/posts/like"
    echo "Body: {\"postId\": \"$FIRST_POST_ID\", \"userId\": \"$TEST_USER_ID\"}"

    LIKE_RESPONSE=$(curl -s -X POST "$SERVER_URL/api/posts/like" \
      -H "Content-Type: application/json" \
      -d "{\"postId\": \"$FIRST_POST_ID\", \"userId\": \"$TEST_USER_ID\"}")

    echo "$LIKE_RESPONSE" | jq . 2>/dev/null || echo "$LIKE_RESPONSE"
    echo ""

    # 检查返回的likes数
    NEW_LIKES=$(echo "$LIKE_RESPONSE" | jq -r '.likes' 2>/dev/null)
    echo "点赞后的 likes 数: $NEW_LIKES"

    if [ "$NEW_LIKES" = "1" ]; then
        echo "✅ 点赞成功，likes = 1"
    else
        echo "❌ 点赞异常，likes = $NEW_LIKES（应该是1）"
    fi
fi

echo ""
echo "========================================="
echo "验证完成"
echo "========================================="
