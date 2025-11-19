# Friends System Testing Guide

## Quick Start

### 1. Start the Backend
```bash
cd backend
uvicorn src.main:app --reload
```

### 2. View Interactive API Documentation
Open your browser and go to:
```
http://localhost:8000/docs
```

This will show you all the Friends API endpoints with a built-in testing interface!

---

## Testing Methods

### Method 1: Interactive API Docs (Easiest!)
1. Go to `http://localhost:8000/docs`
2. Scroll down to the "Friends" section
3. Click on any endpoint to expand it
4. Click "Try it out"
5. Fill in the parameters
6. Click "Execute"

### Method 2: Bash Script
```bash
cd backend
chmod +x test_friends_api.sh
./test_friends_api.sh
```

**Requirements**: `curl` and `jq` (for JSON formatting)

### Method 3: Python Script
```bash
cd backend
python test_friends_api.py
```

**Requirements**: `pip install requests`

### Method 4: Postman/Thunder Client
1. Import `friends_api_collection.json` into Postman or Thunder Client
2. Run the requests in order

### Method 5: Manual cURL Commands

#### Search Users
```bash
curl -X GET "http://localhost:8000/api/friends/1/search?query=user"
```

#### Send Friend Request
```bash
curl -X POST "http://localhost:8000/api/friends/1/send" \
  -H "Content-Type: application/json" \
  -d '{"target_user_id": 2}'
```

#### Get Friend Requests
```bash
curl -X GET "http://localhost:8000/api/friends/1/requests"
```

#### Accept Friend Request
```bash
curl -X POST "http://localhost:8000/api/friends/2/accept/1"
```

#### Get Friends List
```bash
curl -X GET "http://localhost:8000/api/friends/1/list"
```

#### Decline Friend Request
```bash
curl -X DELETE "http://localhost:8000/api/friends/1/decline/3"
```

#### Cancel Sent Friend Request
```bash
curl -X DELETE "http://localhost:8000/api/friends/1/cancel/3"
```

#### Remove Friend
```bash
curl -X DELETE "http://localhost:8000/api/friends/1/remove/2"
```

---

## Test Scenario

Here's a complete test scenario you can follow:

### Setup
Make sure you have at least 4 users in your database (user IDs 1, 2, 3, 4)

### Scenario Steps

1. **User 1 searches for users**
   ```bash
   curl "http://localhost:8000/api/friends/1/search?query=user"
   ```

2. **User 1 sends friend request to User 2**
   ```bash
   curl -X POST "http://localhost:8000/api/friends/1/send" \
     -H "Content-Type: application/json" \
     -d '{"target_user_id": 2}'
   ```

3. **User 2 checks their friend requests**
   ```bash
   curl "http://localhost:8000/api/friends/2/requests"
   ```
   Should show User 1 in "received" array

4. **User 2 accepts the request**
   ```bash
   curl -X POST "http://localhost:8000/api/friends/2/accept/1"
   ```

5. **Both users check their friends list**
   ```bash
   curl "http://localhost:8000/api/friends/1/list"
   curl "http://localhost:8000/api/friends/2/list"
   ```
   Both should show each other as friends

6. **User 1 sends request to User 3**
   ```bash
   curl -X POST "http://localhost:8000/api/friends/1/send" \
     -H "Content-Type: application/json" \
     -d '{"target_user_id": 3}'
   ```

7. **User 1 cancels the request**
   ```bash
   curl -X DELETE "http://localhost:8000/api/friends/1/cancel/3"
   ```

8. **User 4 sends request to User 1**
   ```bash
   curl -X POST "http://localhost:8000/api/friends/4/send" \
     -H "Content-Type: application/json" \
     -d '{"target_user_id": 1}'
   ```

9. **User 1 declines the request**
   ```bash
   curl -X DELETE "http://localhost:8000/api/friends/1/decline/4"
   ```

10. **User 1 removes User 2 from friends**
    ```bash
    curl -X DELETE "http://localhost:8000/api/friends/1/remove/2"
    ```

11. **Verify friends list is empty**
    ```bash
    curl "http://localhost:8000/api/friends/1/list"
    ```

---

## Expected Responses

### Success Responses

**Send Friend Request**
```json
{
  "message": "Friend request sent to username"
}
```

**Accept Friend Request**
```json
{
  "message": "You are now friends with username"
}
```

**Friends List**
```json
[
  {
    "user_id": 2,
    "username": "user2",
    "leetcode_username": "leetcode_user2",
    "user_elo": 1500
  }
]
```

**Friend Requests**
```json
{
  "sent": [
    {
      "user_id": 3,
      "username": "user3",
      "leetcode_username": "leetcode_user3",
      "user_elo": 1400
    }
  ],
  "received": [
    {
      "user_id": 4,
      "username": "user4",
      "leetcode_username": "leetcode_user4",
      "user_elo": 1600
    }
  ]
}
```

### Error Responses

**User Not Found (404)**
```json
{
  "detail": "User not found"
}
```

**Cannot Send to Self (400)**
```json
{
  "detail": "Cannot send friend request to yourself"
}
```

**Already Friends (400)**
```json
{
  "detail": "Already friends with this user"
}
```

**Duplicate Request (400)**
```json
{
  "detail": "Friend request already sent"
}
```

---

## Troubleshooting

### Backend Not Running
```
Error: Could not connect to localhost:8000
```
**Solution**: Start the backend with `uvicorn src.main:app --reload`

### User Not Found
```json
{"detail": "User not found"}
```
**Solution**: Make sure the user IDs exist in your database

### Database Connection Error
**Solution**: Check your `DATABASE_URL` in `.env` file

### Friends Table Doesn't Exist
**Solution**: The table should be created automatically, but if not:
```sql
CREATE TABLE IF NOT EXISTS friends (
    user_id INT(11) NOT NULL,
    current_friends LONGTEXT DEFAULT (JSON_ARRAY()),
    friend_requests_sent LONGTEXT DEFAULT (JSON_ARRAY()),
    friend_requests_received LONGTEXT DEFAULT (JSON_ARRAY()),
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

---

## Tips

1. **Use the Interactive Docs**: The FastAPI docs at `/docs` are the easiest way to test
2. **Check Response Status**: 200 = success, 400 = bad request, 404 = not found
3. **Test in Order**: Follow the test scenario to see the full flow
4. **Use jq for Pretty JSON**: Pipe curl output through `jq '.'` for formatted JSON
5. **Check Database**: Query the `friends` table directly to verify data

---

## All Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/friends/{user_id}/send` | Send friend request |
| POST | `/api/friends/{user_id}/accept/{requester_id}` | Accept friend request |
| DELETE | `/api/friends/{user_id}/decline/{requester_id}` | Decline friend request |
| DELETE | `/api/friends/{user_id}/cancel/{target_id}` | Cancel sent request |
| DELETE | `/api/friends/{user_id}/remove/{friend_id}` | Remove friend |
| GET | `/api/friends/{user_id}/list` | Get friends list |
| GET | `/api/friends/{user_id}/requests` | Get friend requests |
| GET | `/api/friends/{user_id}/search?query=` | Search users |

---

Happy Testing! 🎉
