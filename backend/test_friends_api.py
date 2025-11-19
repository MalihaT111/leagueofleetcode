#!/usr/bin/env python3
"""
Friends API Testing Script
Make sure your backend is running: uvicorn src.main:app --reload
"""

import requests
import json
from typing import Dict, Any

BASE_URL = "http://localhost:8000"

def print_test(test_num: int, description: str):
    """Print test header"""
    print(f"\n{'='*60}")
    print(f"Test {test_num}: {description}")
    print('='*60)

def print_response(response: requests.Response):
    """Print formatted response"""
    print(f"Status: {response.status_code}")
    try:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response: {response.text}")

def test_search_users(user_id: int, query: str):
    """Test searching for users"""
    print_test(1, f"Search for users with query: '{query}'")
    response = requests.get(f"{BASE_URL}/api/friends/{user_id}/search", params={"query": query})
    print_response(response)
    return response

def test_send_friend_request(sender_id: int, target_id: int):
    """Test sending a friend request"""
    print_test(2, f"Send friend request: User {sender_id} -> User {target_id}")
    response = requests.post(
        f"{BASE_URL}/api/friends/{sender_id}/send",
        json={"target_user_id": target_id}
    )
    print_response(response)
    return response

def test_get_friend_requests(user_id: int):
    """Test getting friend requests"""
    print_test(3, f"Get friend requests for User {user_id}")
    response = requests.get(f"{BASE_URL}/api/friends/{user_id}/requests")
    print_response(response)
    return response

def test_accept_friend_request(user_id: int, requester_id: int):
    """Test accepting a friend request"""
    print_test(4, f"Accept friend request: User {user_id} accepts User {requester_id}")
    response = requests.post(f"{BASE_URL}/api/friends/{user_id}/accept/{requester_id}")
    print_response(response)
    return response

def test_get_friends_list(user_id: int):
    """Test getting friends list"""
    print_test(5, f"Get friends list for User {user_id}")
    response = requests.get(f"{BASE_URL}/api/friends/{user_id}/list")
    print_response(response)
    return response

def test_decline_friend_request(user_id: int, requester_id: int):
    """Test declining a friend request"""
    print_test(6, f"Decline friend request: User {user_id} declines User {requester_id}")
    response = requests.delete(f"{BASE_URL}/api/friends/{user_id}/decline/{requester_id}")
    print_response(response)
    return response

def test_cancel_friend_request(sender_id: int, target_id: int):
    """Test canceling a sent friend request"""
    print_test(7, f"Cancel friend request: User {sender_id} -> User {target_id}")
    response = requests.delete(f"{BASE_URL}/api/friends/{sender_id}/cancel/{target_id}")
    print_response(response)
    return response

def test_remove_friend(user_id: int, friend_id: int):
    """Test removing a friend"""
    print_test(8, f"Remove friend: User {user_id} removes User {friend_id}")
    response = requests.delete(f"{BASE_URL}/api/friends/{user_id}/remove/{friend_id}")
    print_response(response)
    return response

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("Friends System API Testing")
    print("="*60)
    
    try:
        # Test 1: Search for users
        test_search_users(1, "user")
        
        # Test 2: Send friend request
        test_send_friend_request(1, 2)
        
        # Test 3: Get friend requests
        test_get_friend_requests(2)
        
        # Test 4: Accept friend request
        test_accept_friend_request(2, 1)
        
        # Test 5: Get friends list for both users
        test_get_friends_list(1)
        test_get_friends_list(2)
        
        # Test 6: Send another request
        test_send_friend_request(1, 3)
        
        # Test 7: Cancel the request
        test_cancel_friend_request(1, 3)
        
        # Test 8: Send request from another user
        test_send_friend_request(4, 1)
        
        # Test 9: Decline the request
        test_decline_friend_request(1, 4)
        
        # Test 10: Remove friend
        test_remove_friend(1, 2)
        
        # Test 11: Verify friends list is empty
        test_get_friends_list(1)
        
        print("\n" + "="*60)
        print("✅ All tests completed!")
        print("="*60 + "\n")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to the backend.")
        print("Make sure the backend is running: uvicorn src.main:app --reload")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    main()
