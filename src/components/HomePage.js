import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const decoded = jwtDecode(token);
        const response = await axios.get('http://localhost:5000/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        const user = response.data.find((u) => u._id === decoded.userId);
        if (user) {
          setFriends(user.friends);
          setFriendRequests(user.friendRequests);
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [navigate]);

  const handleAddFriend = async (friendId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:5000/users/add-friend',
        { friendId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFriends([...friends, friendId]);
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const handleAcceptFriendRequest = async (friendId) => {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    try {
      await axios.post(
        'http://localhost:5000/accept-friend-request',
        { userId: decoded.userId, friendId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFriends([...friends, friendId]);
      setFriendRequests(friendRequests.filter(id => id !== friendId));
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    try {
      await axios.post(
        'http://localhost:5000/users/remove-friend',
        { friendId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFriends(friends.filter((id) => id !== friendId));
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <input
        type="text"
        placeholder="Search users"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul>
        {users
          .filter((user) => user.username && user.username.includes(search))
          .map((user) => (
            <li key={user._id}>
              {user.username}
              {friends.includes(user._id) ? (
                <button onClick={() => handleRemoveFriend(user._id)}>
                  Unfriend
                </button>
              ) : friendRequests.includes(user._id) ? (
                <button onClick={() => handleAcceptFriendRequest(user._id)}>
                  Accept Friend Request
                </button>
              ) : sentRequests.includes(user._id) ? (
                <button disabled>Already Sent</button>
              ) : (
                <button onClick={() => handleAddFriend(user._id)}>Add Friend</button>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default HomePage;