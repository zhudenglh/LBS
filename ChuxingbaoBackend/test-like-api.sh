#!/bin/bash

# 测试点赞API脚本

echo "========================================="
echo "测试出行宝点赞功能"
echo "========================================="
echo ""

SERVER_URL="http://101.37.70.167:3000"

# 测试变量
TEST_POST_ID="post_1729134020834_xmwg7m"  # 替换为实际的帖子ID
TEST_USER_ID="test_user_123"

echo "步骤 1: 测试健康检查"
echo "GET $SERVER_URL/health"
curl -s "$SERVER_URL/health" | jq .
echo ""
echo ""

echo "步骤 2: 获取帖子列表（带用户ID）"
echo "GET $SERVER_URL/api/posts?userId=$TEST_USER_ID"
POSTS_RESPONSE=$(curl -s "$SERVER_URL/api/posts?userId=$TEST_USER_ID")
echo "$POSTS_RESPONSE" | jq '.posts[0]' 2>/dev/null || echo "$POSTS_RESPONSE"
echo ""

# 获取第一个帖子的ID
FIRST_POST_ID=$(echo "$POSTS_RESPONSE" | jq -r '.posts[0].post_id' 2>/dev/null)
if [ -n "$FIRST_POST_ID" ] && [ "$FIRST_POST_ID" != "null" ]; then
    TEST_POST_ID="$FIRST_POST_ID"
    echo "✅ 使用帖子ID: $TEST_POST_ID"
else
    echo "⚠️  无法获取帖子ID，使用默认值: $TEST_POST_ID"
fi
echo ""
echo ""

echo "步骤 3: 测试点赞API"
echo "POST $SERVER_URL/api/posts/like"
echo "Body: {\"postId\": \"$TEST_POST_ID\", \"userId\": \"$TEST_USER_ID\"}"
LIKE_RESPONSE=$(curl -s -X POST "$SERVER_URL/api/posts/like" \
  -H "Content-Type: application/json" \
  -d "{\"postId\": \"$TEST_POST_ID\", \"userId\": \"$TEST_USER_ID\"}")
echo "$LIKE_RESPONSE" | jq . 2>/dev/null || echo "$LIKE_RESPONSE"
echo ""
echo ""

echo "步骤 4: 再次获取帖子列表，检查点赞状态"
echo "GET $SERVER_URL/api/posts?userId=$TEST_USER_ID"
POSTS_RESPONSE_2=$(curl -s "$SERVER_URL/api/posts?userId=$TEST_USER_ID")
echo "$POSTS_RESPONSE_2" | jq ".posts[] | select(.post_id == \"$TEST_POST_ID\")" 2>/dev/null || echo "$POSTS_RESPONSE_2"
echo ""
echo ""

echo "步骤 5: 测试取消点赞API"
echo "POST $SERVER_URL/api/posts/unlike"
UNLIKE_RESPONSE=$(curl -s -X POST "$SERVER_URL/api/posts/unlike" \
  -H "Content-Type: application/json" \
  -d "{\"postId\": \"$TEST_POST_ID\", \"userId\": \"$TEST_USER_ID\"}")
echo "$UNLIKE_RESPONSE" | jq . 2>/dev/null || echo "$UNLIKE_RESPONSE"
echo ""
echo ""

echo "步骤 6: 最后一次获取帖子列表，检查取消点赞状态"
echo "GET $SERVER_URL/api/posts?userId=$TEST_USER_ID"
POSTS_RESPONSE_3=$(curl -s "$SERVER_URL/api/posts?userId=$TEST_USER_ID")
echo "$POSTS_RESPONSE_3" | jq ".posts[] | select(.post_id == \"$TEST_POST_ID\")" 2>/dev/null || echo "$POSTS_RESPONSE_3"
echo ""

echo "========================================="
echo "测试完成！"
echo "========================================="
