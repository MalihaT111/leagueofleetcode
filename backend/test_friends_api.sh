#!/bin/bash

# Friends API Testing Script
# Make sure your backend is running: uvicorn src.main:app --reload

BASE_URL="http://localhost:8000"

echo "=========================================="
echo "Friends System API Testing"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test 1: Search for users
echo -e "${BLUE}1. Search for users${NC}"
echo "GET $BASE_URL/api/friends/1/search?query=user"
curl -s -X GET "$BASE_URL/api/friends/1/search?query=user" | jq '.'
echo ""
echo ""

# Test 2: Send friend request from user 1 to user 2
echo -e "${BLUE}2. Send friend request (User 1 -> User 2)${NC}"
echo "POST $BASE_URL/api/friends/1/send"
curl -s -X POST "$BASE_URL/api/friends/1/send" \
  -H "Content-Type: application/json" \
  -d '{"target_user_id": 2}' | jq '.'
echo ""
echo ""

# Test 3: Get friend requests for user 2
echo -e "${BLUE}3. Get friend requests for User 2${NC}"
echo "GET $BASE_URL/api/friends/2/requests"
curl -s -X GET "$BASE_URL/api/friends/2/requests" | jq '.'
echo ""
echo ""

# Test 4: Accept friend request (User 2 accepts User 1)
echo -e "${BLUE}4. Accept friend request (User 2 accepts User 1)${NC}"
echo "POST $BASE_URL/api/friends/2/accept/1"
curl -s -X POST "$BASE_URL/api/friends/2/accept/1" | jq '.'
echo ""
echo ""

# Test 5: Get friends list for user 1
echo -e "${BLUE}5. Get friends list for User 1${NC}"
echo "GET $BASE_URL/api/friends/1/list"
curl -s -X GET "$BASE_URL/api/friends/1/list" | jq '.'
echo ""
echo ""

# Test 6: Get friends list for user 2
echo -e "${BLUE}6. Get friends list for User 2${NC}"
echo "GET $BASE_URL/api/friends/2/list"
curl -s -X GET "$BASE_URL/api/friends/2/list" | jq '.'
echo ""
echo ""

# Test 7: Send another friend request (User 1 -> User 3)
echo -e "${BLUE}7. Send friend request (User 1 -> User 3)${NC}"
echo "POST $BASE_URL/api/friends/1/send"
curl -s -X POST "$BASE_URL/api/friends/1/send" \
  -H "Content-Type: application/json" \
  -d '{"target_user_id": 3}' | jq '.'
echo ""
echo ""

# Test 8: Cancel friend request (User 1 cancels request to User 3)
echo -e "${BLUE}8. Cancel friend request (User 1 -> User 3)${NC}"
echo "DELETE $BASE_URL/api/friends/1/cancel/3"
curl -s -X DELETE "$BASE_URL/api/friends/1/cancel/3" | jq '.'
echo ""
echo ""

# Test 9: Send request from User 4 to User 1
echo -e "${BLUE}9. Send friend request (User 4 -> User 1)${NC}"
echo "POST $BASE_URL/api/friends/4/send"
curl -s -X POST "$BASE_URL/api/friends/4/send" \
  -H "Content-Type: application/json" \
  -d '{"target_user_id": 1}' | jq '.'
echo ""
echo ""

# Test 10: Decline friend request (User 1 declines User 4)
echo -e "${BLUE}10. Decline friend request (User 1 declines User 4)${NC}"
echo "DELETE $BASE_URL/api/friends/1/decline/4"
curl -s -X DELETE "$BASE_URL/api/friends/1/decline/4" | jq '.'
echo ""
echo ""

# Test 11: Remove friend (User 1 removes User 2)
echo -e "${BLUE}11. Remove friend (User 1 removes User 2)${NC}"
echo "DELETE $BASE_URL/api/friends/1/remove/2"
curl -s -X DELETE "$BASE_URL/api/friends/1/remove/2" | jq '.'
echo ""
echo ""

# Test 12: Verify friends list is empty
echo -e "${BLUE}12. Verify friends list for User 1 (should be empty)${NC}"
echo "GET $BASE_URL/api/friends/1/list"
curl -s -X GET "$BASE_URL/api/friends/1/list" | jq '.'
echo ""
echo ""

echo -e "${GREEN}=========================================="
echo "Testing Complete!"
echo "==========================================${NC}"
