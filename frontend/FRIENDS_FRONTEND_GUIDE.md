# Friends System Frontend Guide

## Overview

The Friends system has been fully integrated into the frontend with a dedicated page accessible from the home page and navbar.

## Files Created

### 1. API Layer
- **`src/lib/api/friends.js`** - Raw API functions for all friends endpoints
- **`src/lib/api/queries/friends/index.ts`** - React Query hooks with automatic cache invalidation

### 2. UI Components
- **`src/app/friends/page.tsx`** - Main friends page with tabs for:
  - My Friends list
  - Friend Requests (received & sent)
  - Add Friends (search)

### 3. Navigation Updates
- **`src/app/home/page.tsx`** - Added "Friends" button
- **`src/components/homenav.tsx`** - Added "FRIENDS" link to navbar

## Features

### My Friends Tab
- View all your friends
- See their username, LeetCode username, and ELO
- Remove friends with one click
- Shows friend count in tab header

### Requests Tab
- **Received Requests**: Accept or decline incoming friend requests
- **Sent Requests**: View pending requests you've sent and cancel them
- Shows total request count in tab header

### Add Friends Tab
- Search for users by username or LeetCode username
- Minimum 2 characters required
- Results show user info and ELO
- Send friend requests with one click
- Search results are cached for 30 seconds

## How to Use

### 1. Access the Friends Page
- Click "Friends" button on home page, OR
- Click "FRIENDS" link in the top navbar

### 2. Add a Friend
1. Go to "Add Friends" tab
2. Type a username in the search box (min 2 characters)
3. Click "Add Friend" button next to the user you want to add
4. They'll receive your request in their "Requests" tab

### 3. Manage Friend Requests
1. Go to "Requests" tab
2. **Received section**: Click ✓ to accept or ✗ to decline
3. **Sent section**: Click ✗ to cancel a pending request

### 4. View & Remove Friends
1. Go to "My Friends" tab
2. See all your friends with their info
3. Click the remove icon (−) to unfriend someone

## Technical Details

### React Query Integration
All data is managed with React Query for:
- Automatic caching
- Background refetching
- Optimistic updates
- Cache invalidation on mutations

### Auto-refresh
- Friends list: Cached for 10 seconds
- Friend requests: Cached for 5 seconds
- Search results: Cached for 30 seconds

### Error Handling
All API calls include error handling with user-friendly messages.

### Loading States
All buttons and lists show loading states during API calls.

## Styling

The page uses your existing design system:
- Dark theme (#1a1a1a background)
- Yellow accent color (#FFBD42)
- Montserrat font for titles
- Mantine UI components
- Consistent with other pages

## API Endpoints Used

| Action | Endpoint | Method |
|--------|----------|--------|
| Search users | `/api/friends/{user_id}/search?query=` | GET |
| Send request | `/api/friends/{user_id}/send` | POST |
| Get friends | `/api/friends/{user_id}/list` | GET |
| Get requests | `/api/friends/{user_id}/requests` | GET |
| Accept request | `/api/friends/{user_id}/accept/{requester_id}` | POST |
| Decline request | `/api/friends/{user_id}/decline/{requester_id}` | DELETE |
| Cancel request | `/api/friends/{user_id}/cancel/{target_id}` | DELETE |
| Remove friend | `/api/friends/{user_id}/remove/{friend_id}` | DELETE |

## Testing

1. **Start backend**: `uvicorn src.main:app --reload`
2. **Start frontend**: `npm run dev`
3. **Navigate to**: `http://localhost:3000/friends`
4. **Test with multiple users**: Open incognito windows to test with different accounts

## Future Enhancements

Potential features to add:
- Friend status indicator (online/offline)
- Mutual friends display
- Friend suggestions based on ELO
- Direct message to friends
- Challenge friend to a match
- Friend activity feed
- Bulk accept/decline requests

## Troubleshooting

### "Failed to get current user"
- Make sure you're logged in
- Check if backend is running

### Search not working
- Ensure query is at least 2 characters
- Check backend is running on port 8000

### Friends not showing
- Check if friends table exists in database
- Verify backend API is working with `/docs`

---

Enjoy the new Friends system! 🎉
