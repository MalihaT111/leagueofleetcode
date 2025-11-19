# Two-Step Registration Flow

## Overview
The registration system now uses a two-step process where users are NOT created in the database until they verify their LeetCode username.

## Flow

### Single-Page Registration (`/signup`)

**Step 1: Initial Registration**
1. User enters email and password
2. Frontend calls `POST /auth/register/init`
3. Backend:
   - Validates email is not already registered
   - Hashes the password
   - Generates a random verification hash (32-byte URL-safe token)
   - Stores registration data temporarily (in-memory, expires in 24 hours)
   - Returns the verification hash to the user
4. Frontend displays the verification hash on the same page

**Step 2: LeetCode Verification (same page)**
1. User sees the verification hash with a copy button
2. User adds the hash to their LeetCode profile bio
3. User enters their LeetCode username in the form below
4. Frontend calls `POST /auth/register/complete` with email and leetcode_username
5. Backend:
   - Retrieves temporary registration data by email
   - Validates LeetCode username is not already taken
   - **Fetches the user's LeetCode profile via GraphQL API**
   - **Verifies the hash exists in the user's profile bio (aboutMe field)**
   - If verification passes, creates the actual User record in the database with:
     - Email
     - Hashed password
     - LeetCode username
     - Verification hash
     - Default ELO (1200)
   - Deletes temporary registration data
6. User is redirected to `/signin` to log in

## Key Changes

### Backend
- **New files:**
  - `backend/src/auth/temp_registration.py` - Temporary registration storage
  - `backend/src/auth/registration_routes.py` - New registration endpoints

- **New endpoints:**
  - `POST /auth/register/init` - Start registration, get verification hash
  - `POST /auth/register/complete` - Complete registration with LeetCode username (includes verification)
  - `GET /auth/register/status/{email}` - Check pending registration status
  - `GET /api/leetcode/user/{username}/profile` - Get LeetCode user profile including bio

- **Modified:**
  - `backend/src/main.py` - Added custom registration router, disabled default FastAPI-users registration
  - `backend/src/auth/auth.py` - Removed hash generation from user creation

### Frontend
- **Modified files:**
  - `frontend/src/utils/auth.ts` - Added new registration methods (`initiateRegistration`, `completeRegistration`)
  - `frontend/src/app/signup/page.tsx` - Single-page registration with inline verification
  - `frontend/src/app/verify-leetcode/page.tsx` - No longer used for new registrations (can be removed)

## Benefits
1. **No orphaned users** - Users are only created after successful LeetCode verification
2. **Clean database** - No users with null leetcode_username
3. **Better UX** - Single-page registration flow with verification hash and username input on the same screen
4. **Secure** - Temporary registrations expire after 24 hours
5. **Streamlined** - No page navigation required during registration

## Notes
- Temporary registrations are stored in-memory (for production, consider Redis or database table)
- **The system now verifies the hash exists in the user's LeetCode profile bio via the LeetCode GraphQL API**
- Old FastAPI-users `/auth/register` endpoint is disabled but kept in code for reference
- Verification is done by fetching the user's profile and checking if the hash appears in their `aboutMe` field
