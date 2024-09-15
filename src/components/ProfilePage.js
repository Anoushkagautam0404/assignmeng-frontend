import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchFriendsAndRequests = async () => {
      try {
        const decoded = jwtDecode(token);
        const friendsResponse = await axios.get(`http://localhost:5000/friends/${decoded.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(friendsResponse.data);

        const requestsResponse = await axios.get(`http://localhost:5000/pending-friend-requests/${decoded.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingRequests(requestsResponse.data);
      } catch (error) {
        console.error('Error fetching friends and pending friend requests:', error);
      }
    };
    fetchFriendsAndRequests();
  }, [navigate]);

  return (
    <div>
      <h1>Profile Page</h1>
      <h2>Friends</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend._id}>{friend.username}</li>
        ))}
      </ul>
      <h2>Pending Friend Requests</h2>
      <ul>
        {pendingRequests.map((request) => (
          <li key={request._id}>{request.username}</li>
        ))}
      </ul>
    </div>
  );
}

export default ProfilePage;