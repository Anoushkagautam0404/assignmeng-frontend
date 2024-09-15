import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to MyWebsite</h1>
      <div>
        <button onClick={() => navigate('/login')} style={{ marginRight: '10px' }}>
          Login
        </button>
        <button onClick={() => navigate('/signup')}>
          Signup
        </button>
      </div>
    </div>
  );
}

export default LandingPage;