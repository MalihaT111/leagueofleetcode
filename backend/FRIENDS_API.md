# Friends System API Documentation

## Overview
Complete friends system implementation with friend requests, acceptance/decline, and friend management.

## Database Schema
The `friends` table structure:
- `user_id`: INT(11), Primary Key, Foreign Key to `users.user_id`
- `current_friends`: LONGTEXT, JSON array of user IDs who are friends
- `friend_requests_sent`: LONGTEXT, JSON array of user IDs to whom requests were sent
- `friend_requests_received`: LONGTEXT, JSON array of user IDs from whom requests were received

**Note**: The `friends` table is separate from the `users` table, with a one-to-one relationship via `user_id`.

## API Endpoints

### 1. Send Friend Request
**POST** `/api/friends/{user_id}/send`

**Body:**
```json
{
  "target_user_id": 123
}
```

**Response:**
```json
{
  "message": "Friend request sent to username"
}
```

**Validations:**
- Cannot send request to self
- Cannot send duplicate requests
- Cannot send if already friends
- Cannot send if target already sent you a request

---

### 2. Accept Friend Request
**POST** `/api/friends/{user_id}/accept/{requester_id}`

**Response:**
```json
{
  "message": "You are now friends with username"
}
```

**Actions:**
- Removes from `friend_requests_received` (current user)
- Removes from `friend_requests_sent` (requester)
- Adds to `current_friends` (both users)

---

### 3. Decline Friend Request
**DELETE** `/api/friends/{user_id}/decline/{requester_id}`

**Response:**
```json
{
  "message": "Friend request declined"
}
```

**Actions:**
- Removes from `friend_requests_received` (current user)
- Removes from `friend_requests_sent` (requester)

---

### 4. Cancel Sent Friend Request
**DELETE** `/api/friends/{user_id}/cancel/{target_id}`

**Response:**
```json
{
  "message": "Friend request cancelled"
}
```

**Actions:**
- Removes from `friend_requests_sent` (current user)
- Removes from `friend_requests_received` (target user)

---

### 5. Remove Friend
**DELETE** `/api/friends/{user_id}/remove/{friend_id}`

**Response:**
```json
{
  "message": "Removed username from friends"
}
```

**Actions:**
- Removes from `current_friends` (both users)

---

### 6. Get Friends List
**GET** `/api/friends/{user_id}/list`

**Response:**
```json
[
  {
    "user_id": 123,
    "username": "user123",
    "leetcode_username": "leetcode_user",
    "user_elo": 1500
  }
]
```

---

### 7. Get Friend Requests
**GET** `/api/friends/{user_id}/requests`

**Response:**
```json
{
  "sent": [
    {
      "user_id": 123,
      "username": "user123",
      "leetcode_username": "leetcode_user",
      "user_elo": 1500
    }
  ],
  "received": [
    {
      "user_id": 456,
      "username": "user456",
      "leetcode_username": "leetcode_user2",
      "user_elo": 1600
    }
  ]
}
```

---

### 8. Search Users
**GET** `/api/friends/{user_id}/search?query=username`

**Query Parameters:**
- `query`: Search term (minimum 2 characters)

**Response:**
```json
[
  {
    "user_id": 789,
    "username": "searchuser",
    "leetcode_username": "leetcode_search",
    "user_elo": 1400
  }
]
```

**Features:**
- Searches by username or leetcode_username
- Excludes current user from results
- Limits to 20 results

---

## Additional Features to Consider

### 1. Friend Status Endpoint
**GET** `/api/friends/{user_id}/status/{other_user_id}`

Returns the relationship status between two users:
- `"friends"`: Already friends
- `"request_sent"`: Current user sent request
- `"request_received"`: Other user sent request
- `"none"`: No relationship

### 2. Mutual Friends
**GET** `/api/friends/{user_id}/mutual/{other_user_id}`

Returns list of mutual friends between two users.

### 3. Friend Suggestions
**GET** `/api/friends/{user_id}/suggestions`

Suggests friends based on:
- Similar ELO rating
- Mutual friends
- Recent match opponents

### 4. Block User
**POST** `/api/friends/{user_id}/block/{target_id}`

Prevents user from:
- Sending friend requests
- Seeing your profile
- Matching in games

### 5. Online Status
Add `last_active` timestamp to track when users were last online.

### 6. Friend Activity Feed
**GET** `/api/friends/{user_id}/activity`

Shows recent activity of friends:
- Match results
- ELO changes
- LeetCode problems solved

### 7. Bulk Operations
**POST** `/api/friends/{user_id}/bulk-accept`

Accept multiple friend requests at once.

---

## Frontend Integration Example

```typescript
// Send friend request
const sendFriendRequest = async (userId: number, targetId: number) => {
  const response = await fetch(`/api/friends/${userId}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target_user_id: targetId })
  });
  return response.json();
};

// Get friends list
const getFriends = async (userId: number) => {
  const response = await fetch(`/api/friends/${userId}/list`);
  return response.json();
};

// Accept friend request
const acceptRequest = async (userId: number, requesterId: number) => {
  const response = await fetch(`/api/friends/${userId}/accept/${requesterId}`, {
    method: 'POST'
  });
  return response.json();
};
```

---

## Testing the API

1. **Start the backend:**
   ```bash
   cd backend
   uvicorn src.main:app --reload
   ```

2. **Test with curl:**
   ```bash
   # Send friend request
   curl -X POST "http://localhost:8000/api/friends/1/send" \
     -H "Content-Type: application/json" \
     -d '{"target_user_id": 2}'
   
   # Get friends list
   curl "http://localhost:8000/api/friends/1/list"
   
   # Accept friend request
   curl -X POST "http://localhost:8000/api/friends/2/accept/1"
   ```

3. **View API docs:**
   Visit `http://localhost:8000/docs` to see interactive API documentation.

---

## Database Migration

The `friends` table should already exist in your database with this structure:

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

**Note**: The friends system automatically creates a record in the `friends` table when a user first interacts with the friends system (sends/receives a request).

---

## Notes

- All friend operations are bidirectional (affect both users)
- Friend requests are automatically cleaned up when accepted/declined
- The system prevents duplicate requests and self-friending
- User IDs are stored as JSON arrays for efficient querying
- All endpoints include proper error handling and validation
