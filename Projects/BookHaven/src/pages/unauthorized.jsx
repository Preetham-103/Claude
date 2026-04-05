import React from 'react';
import { useNavigate } from 'react-router-dom';
import './unauthorized.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-card shadow">
        <h1 className="unauthorized-code">403</h1>
        <h2 className="unauthorized-title">Access Denied</h2>
        <p className="unauthorized-message">
          You don’t have permission to view this page.
        </p>
        <button
          className="btn btn-outline-light unauthorized-btn"
          onClick={() => navigate('/')}
        >
          ⬅ Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;